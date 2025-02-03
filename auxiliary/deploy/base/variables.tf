variable "environment" {
  type        = string
  default     = "dev"
  description = "The type of environment to deploy."
  validation {
    condition     = contains(["dev", "prod"], var.environment)
    error_message = "The environment must be either dev or prod."
  }
}

variable "tom_username" {
  type        = string
  description = "Developer's username."
}

variable "local_ip" {
  type        = string
  description = "Development machine's local IP address."
}

locals {
  public_subnet_cidrs  = var.environment == "dev" ? ["10.0.1.0/28", "10.0.2.0/28", "10.0.3.0/28"] : ["10.0.1.0/28", "10.0.2.0/28", "10.0.3.0/28"]
  private_subnet_cidrs = var.environment == "dev" ? ["10.0.4.0/28", "10.0.5.0/28", "10.0.6.0/28"] : ["10.0.4.0/28", "10.0.5.0/28", "10.0.6.0/28"]
  availability_zones   = var.environment == "dev" ? ["us-east-1a", "us-east-1b", "us-east-1c"] : ["us-east-1a", "us-east-1b", "us-east-1c"]
}
