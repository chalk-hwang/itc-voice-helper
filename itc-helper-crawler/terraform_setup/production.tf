provider "aws" {
  profile = "${var.profile}"
  region  = "${var.region}"
}

locals {
  # The name of the CloudFormation stack to be created for the ECS service and related resources
  aws_ecs_service_stack_name = "${var.aws_resource_prefix}_svc_stack"

  # The name of the ECR repository to be created
  aws_ecr_repository_name = "${var.aws_resource_prefix}"

  # The name of the ECS cluster to be created
  aws_ecs_cluster_name = "${var.aws_resource_prefix}_ecs_cluster"

  # The name of the ECS service to be created
  aws_ecs_service_name = "${var.aws_resource_prefix}_ecs_service"

  # The name of the execution role to be created
  aws_ecs_execution_role_name      = "${var.aws_resource_prefix}_ecs_execution_role"
  aws_ecs_task_execution_role_name = "${var.aws_resource_prefix}_ecs_task_execution_role"
}

/*====
ECR repository to store our Docker images
======*/
resource "aws_ecr_repository" "crawler_repository" {
  name = "${local.aws_ecr_repository_name}"
}

resource "aws_ecs_cluster" "crawler_cluster" {
  name = "${local.aws_ecs_cluster_name}"
}

data "template_file" "crawler_task" {
  template = "${file("${path.module}/tasks/crawler_task_definition.json")}"

  vars {
    image      = "nginx"
    log_group  = "itc-helper-crawler"
    log_region = "ap-northeast-2"
  }
}

resource "aws_ecs_task_definition" "crawler_task" {
  family                   = "${local.aws_ecs_service_name}"
  container_definitions    = "${data.template_file.crawler_task.rendered}"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = "1024"
  memory                   = "2048"
  execution_role_arn       = "${aws_iam_role.ecs_task_execution_role.arn}"
  task_role_arn            = "${aws_iam_role.ecs_task_execution_role.arn}"
}

resource "aws_iam_role" "ecs_task_execution_role" {
  name               = "${local.aws_ecs_task_execution_role_name}"
  assume_role_policy = "${file("${path.module}/policies/ecs-task-execution-role.json")}"
}

resource "aws_iam_role_policy" "ecs_task_execution_role_policy" {
  name   = "${local.aws_ecs_task_execution_role_name}_policy"
  policy = "${file("${path.module}/policies/ecs-task-execution-role-policy.json")}"
  role   = "${aws_iam_role.ecs_task_execution_role.id}"
}

/*====
ECS service
======*/

/* Security Group for ECS */
resource "aws_security_group" "crawler_service" {
  vpc_id      = "${var.vpc_id}"
  name        = "${var.aws_resource_prefix}-ecs-service-sg"
  description = "Allow egress from container"

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 8
    to_port     = 0
    protocol    = "icmp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags {
    Name        = "${var.aws_resource_prefix}-ecs-service-sg"
    Environment = "${var.aws_resource_prefix}"
  }
}

/* Simply specify the family to find the latest ACTIVE revision in that family */
data "aws_ecs_task_definition" "crawler_task" {
  task_definition = "${aws_ecs_task_definition.crawler_task.family}"
}

resource "aws_ecs_service" "crawler_service" {
  name            = "${local.aws_ecs_service_name}"
  task_definition = "${aws_ecs_task_definition.crawler_task.family}:${max("${aws_ecs_task_definition.crawler_task.revision}", "${data.aws_ecs_task_definition.crawler_task.revision}")}"
  desired_count   = 2
  launch_type     = "FARGATE"
  cluster         = "${aws_ecs_cluster.crawler_cluster.id}"

  network_configuration {
    security_groups = ["${aws_security_group.crawler_service.id}"]
    subnets         = ["${var.subnets_ids}"]
  }
}
