terraform {
  required_providers {
    aws = {
      version = ">= 4.0.0"
      source  = "hashicorp/aws"
    }
  }
}

# specify the provider region
provider "aws" {
  region = "ca-central-1"
}

locals {
  function_name = "create-obituary-30140288"
  second_function_name = "get-obituary-30140288"
  handler_name  = "main.lambda_handler"
  artifact_name = "artifact.zip"
}

# create archive file from main.py
data "archive_file" "create-obituary-30140288" {
  type = "zip"
  # this file (main.py) needs to exist in the same folder as this 
  # Terraform configuration file
  source_dir = "../functions/create-obituary"
  output_path = local.artifact_name
}

# create a role for the Lambda function to assume
resource "aws_iam_role" "lambda" {
  name               = "lambda-role"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

# create a Lambda function
resource "aws_lambda_function" "create-obituary-30140288" {
  role             = aws_iam_role.lambda.arn
  function_name    = local.function_name
  handler          = local.handler_name
  filename         = local.artifact_name
  source_code_hash = data.archive_file.create-obituary-30140288.output_base64sha256

  # see all available runtimes here: https://docs.aws.amazon.com/lambda/latest/dg/API_CreateFunction.html#SSS-CreateFunction-request-Runtime
  runtime = "python3.9"
}

data "archive_file" "get-obituary-30140288" {
  type = "zip"
  source_dir = "../functions/get-obituaries"
  output_path = local.artifact_name
}

resource "aws_lambda_function" "get-obituary-30140288" {
  role             = aws_iam_role.lambda.arn
  function_name    = local.second_function_name
  handler          = local.handler_name
  filename         = local.artifact_name
  source_code_hash = data.archive_file.get-obituary-30140288.output_base64sha256

  runtime = "python3.9"
}

# create a policy for logging
resource "aws_iam_policy" "logs_and_dynamodb" {
  name        = "lambda-logs"
  description = "IAM policy for logging from a lambda"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents",
        "dynamodb:DeleteItem",
        "dynamodb:Query",
        "ssm:GetParametersByPath"
      ],
      "Resource": ["arn:aws:logs:*:*:*", "${aws_dynamodb_table.obituaries-30148859.arn}", "arn:aws:ssm:ca-central-1:564981883983:parameter/the-last-show/"],
      "Effect": "Allow"
    }
  ]
}
EOF
}

# attach the logs policy to the function role
resource "aws_iam_role_policy_attachment" "lambda_logs_and_dynamodb" {
  role       = aws_iam_role.lambda.name
  policy_arn = aws_iam_policy.logs_and_dynamodb.arn
}

# create a DynamoDB table
resource "aws_dynamodb_table" "obituaries-30148859" {
  name          = "obituaries-30148859"
  billing_mode = "PROVISIONED"
  read_capacity = 1
  write_capacity = 1
  hash_key = "name"
  attribute {
    name = "name"
    type = "S"
  }
}



# create a Function URL for Lambda 
# see the docs: https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lambda_function_url
resource "aws_lambda_function_url" "create-obituary-url" {
  function_name      = aws_lambda_function.create-obituary-30140288.function_name
  authorization_type = "NONE"

  cors {
    allow_credentials = true
    allow_origins     = ["*"]
    allow_methods     = ["POST"]
    allow_headers     = ["*"]
    expose_headers    = ["keep-alive", "date"]
  }
}

resource "aws_lambda_function_url" "get-obituary-url" {
  function_name = aws_lambda_function.get-obituary-30140288.function_name
  authorization_type = "NONE"

  cors {
    allow_credentials = true
    allow_origins     = ["*"]
    allow_methods     = ["GET"]
    allow_headers     = ["*"]
    expose_headers    = ["keep-alive", "date"]
  }
}

output "create_obituary_url" {
  value = aws_lambda_function_url.create-obituary-url.function_url
}

output "get_obituary_url" {
  value = aws_lambda_function_url.get-obituary-url.function_url
}