import { tool, generateObject, type ToolSet } from "ai";
import { z } from "zod/v3";

import { getCurrentAgent } from "agents";
import type {
    WorkloadRequirements,
    ArchitectureOption,
} from "../../types";
import type { CloudArchitectAgent } from "@/server";

export const showDefaultWorkloadForConfirmation = tool({
    description: "Show the default workload requirements to the user for confirmation",
    inputSchema: z.object({}),
});

export const updateWorkloadRequirements = tool({
    description: "Update the workload requirements based on user input",
    inputSchema: z.object({
        title: z.string().describe("Title of the workload").optional(),
        description: z.string().describe("Description of the workload").optional(),
        monthlyRequests: z.number().describe("Expected number of requests per month").optional(),
        dataPerRequestKB: z.number().describe("Average data size per request in KB").optional(),
        latencySensitivity: z.enum(["low", "medium", "high"]).describe("Latency sensitivity of the workload").optional(),
        dataResidency: z.enum(["us", "eu", "global"]).describe("Data residency requirement").optional(),
        sensitivity: z.enum(["cost", "performance", "scalability"]).describe("Sensitivity of the workload").optional(),
        complexity: z.enum(["simple", "moderate", "complex"]).describe("Complexity of the workload").optional(),
        style: z.enum(["monolithic", "microservices", "serverless"]).describe("Architectural style of the workload").optional(),
    }),
    execute: async (updatedRequirements: Partial<WorkloadRequirements>) => {
        const { agent } = getCurrentAgent<CloudArchitectAgent>();
        if (!agent) {
            throw new Error("No agent context available");
        }

        const defaultRequirements = agent.initialState.defaultWorkload;

        agent.setState({
            ...agent.state,
            projectState: {
                ...agent.state.projectState,
                requirements: {
                    title: updatedRequirements.title ?? defaultRequirements.title,
                    description: updatedRequirements.description ?? defaultRequirements.description,
                    monthlyRequests: updatedRequirements.monthlyRequests ?? defaultRequirements.monthlyRequests,
                    dataPerRequestKB: updatedRequirements.dataPerRequestKB ?? defaultRequirements.dataPerRequestKB,
                    latencySensitivity: updatedRequirements.latencySensitivity ?? defaultRequirements.latencySensitivity,
                    dataResidency: updatedRequirements.dataResidency ?? defaultRequirements.dataResidency,
                    sensitivity: updatedRequirements.sensitivity ?? defaultRequirements.sensitivity,
                    complexity: updatedRequirements.complexity ?? defaultRequirements.complexity,
                    style: updatedRequirements.style ?? defaultRequirements.style,
                },
                phase: 'generating-architectures'
            }
        });

        return { requirements: agent.state.projectState.requirements };
    }
});

export const generateArchitecturePlans = tool({
    description: "Generate architecture plans based on current workload requirements",
    inputSchema: z.object({
        useDefaultWorkload: z.boolean().describe("Whether to use the default workload requirements").optional().default(true),
    }),
    execute: async ({ useDefaultWorkload }: { useDefaultWorkload?: boolean }) => {
        const { agent } = getCurrentAgent<CloudArchitectAgent>();
        if (!agent) {
            throw new Error("No agent context available");
        }

        const requirements: WorkloadRequirements | undefined = useDefaultWorkload
            ? agent.initialState.defaultWorkload
            : agent.state.projectState.requirements;

        if (!requirements) {
            throw new Error("No workload requirements available");
        }

        const { object: generatedResult } = await generateObject({
            model: agent.state.model,
            prompt: `Generate 2-3 cloud architecture options based on these requirements:
            
            Requirements: ${JSON.stringify(requirements, null, 2)}
            
            Consider factors like:
            - Expected traffic and scale
            - Budget constraints
            - Performance requirements
            - Geographic distribution needs
            - Data residency and compliance
            - Application complexity and architecture style

            Provide diverse options (serverless, containerized, traditional) with different cost/performance tradeoffs in preferred cloud provider technologies.
            Additionally generate one Architecture option comparing it with Cloudflare-first approach, ONLY if you think the use case would have a better impact
            or lesser cost compared to the standard cloud provider technologies.`,
            schema: z.object({
                architectures: z.array(z.object({
                    id: z.string(),
                    name: z.string(),
                    summary: z.string(),
                    components: z.array(z.object({
                        id: z.string(),
                        kind: z.string(),
                        provider: z.string(),
                        name: z.string(),
                        config: z.record(z.any())
                    }))
                }))
            })
        });

        agent.setState({
            ...agent.state,
            projectState: {
                ...agent.state.projectState,
                requirements,
                architectures: generatedResult.architectures as ArchitectureOption[],
                phase: 'awaiting-choice',
            }
        });

        return { architectures: generatedResult.architectures, count: generatedResult.architectures.length };
    }
});

export const tools = {
    showDefaultWorkloadForConfirmation,
    updateWorkloadRequirements,
    generateArchitecturePlans,
} satisfies ToolSet;

export const executions = {
    showDefaultWorkloadForConfirmation: async () => {
        const { agent } = getCurrentAgent<CloudArchitectAgent>();
        if (!agent) {
            throw new Error("No agent context available");
        }

        const defaultWorkload = agent.state.defaultWorkload;

        return {
            message: `Here are the default workload details:\n`,
            workload: defaultWorkload,
            question: `Would you like to proceed with these default settings?`,
        }

    }
}

