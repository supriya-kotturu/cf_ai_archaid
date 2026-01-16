import { routeAgentRequest } from "agents";
import { convertToModelMessages, createUIMessageStream, createUIMessageStreamResponse, stepCountIs, streamText, type StreamTextOnFinishCallback, type ToolSet, type LanguageModel } from "ai";
import { AIChatAgent } from "agents/ai-chat-agent";
import type { ProjectState, ProviderName, WorkloadRequirements } from "./types";
import { processToolCalls, cleanupMessages } from "./utils";
import { systemPrompt } from "./server/prompts/systemPrompt";
import { tools, executions } from "./server/tools";
import { createWorkersAI } from "workers-ai-provider";
import { env } from "cloudflare:workers";

type State = {
  preferredCloudProvider: ProviderName;
  defaultWorkload: WorkloadRequirements;
  projectState: ProjectState;
  model: LanguageModel;
}
// Create a Workers AI factory using the `AI` binding configured in wrangler.jsonc
const workersai = createWorkersAI({ binding: env.AI });

// Default model id — update this to a model available to your Workers AI binding
const defaultModel = workersai("@cf/deepseek-ai/deepseek-r1-distill-qwen-32b");

const defaultWorkload: WorkloadRequirements = {
  title: 'basic website',
  description: 'serving static content with occasional dynamic requests',
  monthlyRequests: 10000,
  dataPerRequestKB: 10,
  latencySensitivity: "low",
  dataResidency: 'global',
  sensitivity: "cost",
  complexity: "simple",
  style: "monolithic"
}

export class CloudArchitectAgent extends AIChatAgent<Env, State> {
  initialState: State = {
    preferredCloudProvider: 'cloudflare',
    defaultWorkload: defaultWorkload,
    projectState: {
      requirements: defaultWorkload,
      architectures: [],
      phase: "collecting-requirements"
    },
    model: defaultModel
  }

  async onChatMessage(
    onFinish: StreamTextOnFinishCallback<ToolSet>,
    _options?: { abortSignal?: AbortSignal }
  ) {
    const allTools = { ...tools }
    const stream = createUIMessageStream({
      execute: async ({ writer }) => {
        // Clean up incomplete tool calls to prevent API errors
        const cleanedMessages = cleanupMessages(this.messages);

        // Process any pending tool calls from previous messages
        const processedMessages = await processToolCalls({
          messages: cleanedMessages,
          dataStream: writer,
          tools: allTools,
          executions,
        });

        const result = streamText({
          system: systemPrompt,
          messages: convertToModelMessages(processedMessages),
          model: this.initialState.model,
          tools: allTools,
          onFinish: onFinish as unknown as StreamTextOnFinishCallback<typeof allTools>,
          stopWhen: stepCountIs(15)
        });

        writer.merge(result.toUIMessageStream())
      }
    })

    return createUIMessageStreamResponse({ stream });
  };
}

export default {
  async fetch(request: Request, env: Env, _ctx: ExecutionContext) {
    const url = new URL(request.url);

    if (url.pathname === "/check-open-ai-key") {
      const hasOpenAIKey = env.OPENAI_API_KEY;
      return Response.json({
        success: hasOpenAIKey
      });
    }
    if (!env.OPENAI_API_KEY) {
      console.error(
        "OPENAI_API_KEY is not set, don't forget to set it locally in .dev.vars, and use `wrangler secret bulk .dev.vars` to upload it to production"
      );
    }
    return (
      (await routeAgentRequest(request, env)) ||
      new Response("Not found", { status: 404 })
    );
  }
} satisfies ExportedHandler<Env>;


