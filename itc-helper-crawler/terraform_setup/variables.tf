variable "region" {
  description = "Region that the instances will be created"
}

variable "profile" {
  description = "aws credential profile"
}

variable "aws_resource_prefix" {
  description = "Prefix to be used in the naming of some of the created AWS resources e.g. demo-webapp"
}

variable "vpc_id" {}

variable "subnets_ids" {
  type = "list"
}
