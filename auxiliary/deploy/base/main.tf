terraform {
  backend "s3" {}
}

provider "aws" {
  region = "us-east-1"
}

resource "time_static" "now" {}

resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"

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

resource "aws_db_subnet_group" "rds"{
  name       = "${var.environment}-rds-subnet-group"
  subnet_ids = aws_subnet.private_subnets[*].id

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

resource "aws_rds_cluster" "rds" {
  cluster_identifier          = "${var.environment}-rds-cluster"
  availability_zones          = local.availability_zones
  engine                      = "postgres"
  db_cluster_instance_class   = local.rds_cluster_instance
  database_name               = "${var.environment}_adventurus_rds"
  db_subnet_group_name        = aws_db_subnet_group.rds.name
  manage_master_user_password = true
  master_username             = "${var.environment}_admin"
  skip_final_snapshot         = true
  storage_type                = "io1"
  allocated_storage           = 100
  iops                        = 1000
}
