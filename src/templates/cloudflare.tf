terraform {
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
  }
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

variable "cloudflare_account_id" {}
variable "cloudflare_zone_id" {}
variable "cloudflare_api_token" {}
variable "domain_name" {
  default = "example.com"
}

# Worker script (build and upload separately)
resource "cloudflare_workers_script" "edge_api" {
  name    = "edge-api"
  content = file("dist/worker.js")
}

resource "cloudflare_workers_route" "edge_api_route" {
  pattern     = "${var.domain_name}/api/*"
  script_name = cloudflare_workers_script.edge_api.name
  zone_id     = var.cloudflare_zone_id
}

# KV namespace for config
resource "cloudflare_workers_kv_namespace" "config_store" {
  title = "config-store"
}

# Vectorize index for semantic search
resource "cloudflare_vectorize_index" "semantic_index" {
  account_id = var.cloudflare_account_id
  name       = "semantic-index"
  dimensions = 768
  metric     = "cosine"
}

# Optionally bind KV and Vectorize to Worker via wrangler.toml or Pages project
