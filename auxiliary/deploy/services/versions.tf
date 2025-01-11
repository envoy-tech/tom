terraform {
  required_version = ">= 1.2.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
    time = {
      source  = "hashicorp/time"
      version = "~> 0.7.2"
    }
    postgresql = {
      source = "cyrilgdn/postgresql"
      version = "1.24.0"
    }
  }
}
