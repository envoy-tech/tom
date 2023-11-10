provider "aws" {
  region = "us-east-1"
  profile = "dev"
}

variable "build_instance_type_x86_64" {
  type = string
  default = "m5.xlarge"
}

variable "deployment_name" {
  type = string
  default = "Build Agent - TOM"
}

variable "ssh_key_path" {
  type = string
  default = "~/.ssh/id_rsa.pub"
}

data "aws_ami" "amazon_linux_2" {
  most_recent = true
  owners = ["amazon"]
  filter {
    name = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp2"]
  }
}

resource "time_static" "now" {}

resource "aws_key_pair" "aws_ssh_key" {
  key_name = "${var.deployment_name}-key-${time_static.now.unix}"
    public_key = file(pathexpand("${var.ssh_key_path}"))

  lifecycle {
    ignore_changes = [public_key]
  }
}

resource "aws_security_group" "ssh_only" {
  description = "Allow SSH inbound traffic"
  name = "${var.deployment_name}-ssh-only-${time_static.now.unix}"
  ingress {
    cidr_blocks = [
    "0.0.0.0/0"
    ]
    description = "SSH Access"
    from_port = 22
    protocol = "tcp"
    to_port = 22
  }
  ingress {
    ipv6_cidr_blocks = [
    "::/0"
    ]
    description = "SSH Access"
    from_port = 22
    protocol = "tcp"
    to_port = 22
  }
}

resource "aws_security_group" "egress_all" {
  description = "Allow all outbound traffic"
  name        = "${var.deployment_name}-egress-all-${time_static.now.unix}"
  egress {
    cidr_blocks = [
      "0.0.0.0/0"
    ]
    from_port = 0
    protocol  = "-1"
    to_port   = 0
  }
}

resource "aws_instance" "build_host_x86_64" {
  ami = data.aws_ami.amazon_linux_2.id
  instance_type = var.build_instance_type_x86_64
  key_name = aws_key_pair.aws_ssh_key.key_name
  vpc_security_group_ids = [
    aws_security_group.ssh_only.id,
    aws_security_group.egress_all.id
  ]

  ebs_block_device {
    device_name = "/dev/xvda"
    volume_size = 100
    volume_type = "gp3"
    delete_on_termination = true
  }

  tags = {
    Name = var.deployment_name
    DeployedBy = "Terraform"
  }

  lifecycle {
    ignore_changes = [ebs_block_device, tags, volume_tags]
  }
}

resource "local_file" "ansible_inventory" {
  content = templatefile("inventory.tpl", {
    build_host_x86_64 = aws_instance.build_host_x86_64.public_ip
  })
  filename = "inventory"
}

output "build_host_x86_64_instance_id" {
  value = aws_instance.build_host_x86_64.id
}

output "build_host_x86_64_public_ip" {
  value = aws_instance.build_host_x86_64.public_ip
}
