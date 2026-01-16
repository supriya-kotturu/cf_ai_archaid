export type ProviderName = "cloudflare" | "aws" | "gcp" | 'multi-cloud';

export type ResourceKind =
  | "cf_worker"
  | "cf_vectorize"
  | "cf_kv"
  | "aws_lambda"
  | "aws_sqs"
  | "aws_dynamodb"
  | "gcp_cloud_run"
  | "gcp_pubsub"
  | "gcp_firestore"
  | "docker_service";

export type WorkloadRequirements = {
  title: string;
  description: string;
  monthlyRequests: number;
  dataPerRequestKB: number;
  latencySensitivity: "low" | "medium" | "high";
  dataResidency: "us" | "eu" | "global";
  sensitivity: "cost" | "performance" | "scalability";
  complexity: "simple" | "moderate" | "complex";
  style: "monolithic" | "microservices" | "serverless";
};

export type ArchitectureComponent = {
  id: string;
  kind: ResourceKind;
  provider: ProviderName;
  name: string;
  config: Record<string, unknown>;
};

export type ArchitectureOption = {
  id: string;
  name: string;
  summary: string;
  components: ArchitectureComponent[];
};

export type ProjectPhase =
  | "collecting-requirements"
  | "generating-architectures"
  | "awaiting-choice"
  | "ready-for-iac"; // after user picks

export type ProjectState = {
  requirements?: WorkloadRequirements;
  architectures: ArchitectureOption[];
  selectedArchitectureId?: string;
  phase: ProjectPhase;
};
