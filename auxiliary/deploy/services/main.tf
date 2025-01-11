terraform {
  backend "s3" {}
}

provider "aws" {
  region = "us-east-1"
}

provider "postgresql" {
  host = aws_rds_cluster.rds.endpoint
  port = aws_rds_cluster.rds.port
  username = aws_rds_cluster.rds.master_username
  password = aws_rds_cluster.rds.master_password
}

resource "time_static" "now" {}
