export type ProviderName = 'cloudflare' | 'aws' | 'gcp';

export type ResourceKind =
  | 'cf_worker'
  | 'cf_vectorize'
  | 'cf_kv'
  | 'aws_lambda'
  | 'gcp_cloud_run'
  | 'docker_service';

export type WorkloadRequirements = {
  title: string;
  description: string;
  monthlyRequests: number;
  dataPerRequestKB: number;
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

export type ProjectState = {
  requirements?: WorkloadRequirements;
  architectures: ArchitectureOption[];
  // Reviewer Agent will later add ranking, costs, etc.
};
