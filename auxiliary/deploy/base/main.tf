terraform {
  backend "s3" {}
}

provider "aws" {
  region = "us-east-1"
}

resource "time_static" "now" {}

resource "aws_ssm_parameter" "developer_ip" {
  name = "/adventurus/developer_ips/${var.tom_username}"
  type = "String"
  value = "${var.local_ip}/32"
}

resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true

  tags = {
    environment = var.environment
    created_at  = time_static.now.unix
  }
}

resource "aws_subnet" "public_subnets" {
  count             = length(local.public_subnet_cidrs)
  vpc_id            = aws_vpc.main.id
  availability_zone = element(local.availability_zones, count.index)
  cidr_block        = element(local.public_subnet_cidrs, count.index)

  tags = {
    name = "public-subnet-${count.index + 1}"
    environment = var.environment
    created_at  = time_static.now.unix
  }
}

resource "aws_subnet" "private_subnets" {
  count             = length(local.private_subnet_cidrs)
  vpc_id            = aws_vpc.main.id
  availability_zone = element(local.availability_zones, count.index)
  cidr_block        = element(local.private_subnet_cidrs, count.index)

  tags = {
    name = "private-subnet-${count.index + 1}"
    environment = var.environment
    created_at  = time_static.now.unix
  }
}

resource "aws_db_subnet_group" "rds" {
  name       = "${var.environment}-rds-subnet-group"
  subnet_ids = aws_subnet.public_subnets[*].id

  tags = {
    environment = var.environment
    created_at  = time_static.now.unix
  }
}

resource "aws_internet_gateway" "internet_gateway" {
  vpc_id = aws_vpc.main.id

  tags = {
    environment = var.environment
    created_at  = time_static.now.unix
  }
}

resource "aws_route_table" "public_route_table" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.internet_gateway.id
  }

  tags = {
    environment = var.environment
    created_at  = time_static.now.unix
  }
}

resource "aws_route_table_association" "public_subnet_association" {
  count          = length(local.public_subnet_cidrs)
  subnet_id      = element(aws_subnet.public_subnets[*].id, count.index)
  route_table_id = aws_route_table.public_route_table.id
}

resource "aws_s3_bucket" "mps_store" {
  bucket        = "${var.environment}-mps-store"
  force_destroy = true

  tags = {
    environment = var.environment
    created_at  = time_static.now.unix
  }
}

resource "aws_ecr_repository" "optimization_engine" {
  name         = "${var.environment}-optimization-engine"
  force_delete = true

  tags = {
    environment = var.environment
    created_at  = time_static.now.unix
  }
}

resource "aws_ecr_repository" "trip_manager" {
  name         = "${var.environment}-trip-manager"
  force_delete = true

  tags = {
    environment = var.environment
    created_at  = time_static.now.unix
  }
}

resource "aws_sns_topic" "default" {
  name = "${var.environment}-app-pub-sub"

  tags = {
    environment = var.environment
    created_ad  = time_static.now.unix
  }
}

data "aws_ssm_parameters_by_path" "allowed_ips" {
  path      = "/adventurus/developer_ips/"
}

resource "aws_security_group" "rds_access" {
  name        = "${var.environment}-rds-access"
  description = "Allow developer access to Aurora RDS"
  vpc_id      = aws_vpc.main.id

  tags = {
    environment = var.environment
    created_at  = time_static.now.unix
  }
}

resource "aws_security_group_rule" "rds_allow_developer_ips" {
  count             = length(data.aws_ssm_parameters_by_path.allowed_ips.values)
  type              = "ingress"
  from_port         = 5432
  to_port           = 5432
  protocol          = "tcp"
  cidr_blocks       = data.aws_ssm_parameters_by_path.allowed_ips.values
  security_group_id = aws_security_group.rds_access.id
}

resource "aws_rds_cluster" "rds" {
  cluster_identifier          = "${var.environment}-rds-cluster"
  engine                      = "aurora-postgresql"
  engine_mode                 = "provisioned"
  database_name               = "adventurus"
  master_username             = "adventurus_admin"
  manage_master_user_password = true
  storage_encrypted           = true
  skip_final_snapshot         = true
  db_subnet_group_name        = aws_db_subnet_group.rds.name
  vpc_security_group_ids      = [aws_security_group.rds_access.id]

  serverlessv2_scaling_configuration {
    max_capacity             = 2.0
    min_capacity             = 0.5
  }
}

resource "aws_rds_cluster_instance" "rds" {
  cluster_identifier  = aws_rds_cluster.rds.id
  instance_class      = "db.serverless"
  engine              = aws_rds_cluster.rds.engine
  engine_version      = aws_rds_cluster.rds.engine_version
  publicly_accessible = true
}
