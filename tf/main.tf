provider "aws" {
  region = "us-east-1"
}

resource "aws_lambda_function" "contacts_lambda" {
  function_name = "contacts_lambda"

  s3_bucket = aws_s3_bucket.lambda_bucket.bucket
  s3_key    = aws_s3_bucket_object.lambda_object.key

  handler = "main.lambda_handler"
  runtime = "python3.8"

  role = aws_iam_role.lambda_exec.arn
}

resource "aws_iam_role" "lambda_exec" {
  name = "lambda_exec_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Principal = {
        Service = "lambda.amazonaws.com"
      }
      Effect = "Allow"
      Sid = ""
    }]
  })
}

resource "aws_api_gateway_rest_api" "contacts_api" {
  name        = "ContactsAPI"
  description = "API Gateway for managing contacts"
}

resource "aws_api_gateway_resource" "contacts_resource" {
  rest_api_id = aws_api_gateway_rest_api.contacts_api.id
  parent_id   = aws_api_gateway_rest_api.contacts_api.root_resource_id
  path_part   = "contacts"
}

resource "aws_api_gateway_method" "get_contacts" {
  rest_api_id   = aws_api_gateway_rest_api.contacts_api.id
  resource_id   = aws_api_gateway_resource.contacts_resource.id
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_method" "post_contact" {
  rest_api_id   = aws_api_gateway_rest_api.contacts_api.id
  resource_id   = aws_api_gateway_resource.contacts_resource.id
  http_method   = "POST"
  authorization = "NONE"
}

resource "aws_api_gateway_resource" "contact_item" {
  rest_api_id = aws_api_gateway_rest_api.contacts_api.id
  parent_id   = aws_api_gateway_resource.contacts_resource.id
  path_part   = "{contactId}"
}

resource "aws_api_gateway_method" "put_contact" {
  rest_api_id   = aws_api_gateway_rest_api.contacts_api.id
  resource_id   = aws_api_gateway_resource.contact_item.id
  http_method   = "PUT"
  authorization = "NONE"
}

resource "aws_api_gateway_method" "delete_contact" {
  rest_api_id   = aws_api_gateway_rest_api.contacts_api.id
  resource_id   = aws_api_gateway_resource.contact_item.id
  http_method   = "DELETE"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "lambda_integration_get" {
  rest_api_id = aws_api_gateway_rest_api.contacts_api.id
  resource_id = aws_api_gateway_resource.contacts_resource.id
  http_method = aws_api_gateway_method.get_contacts.http_method

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.contacts_lambda.invoke_arn
}

resource "aws_api_gateway_integration" "lambda_integration_post" {
  rest_api_id = aws_api_gateway_rest_api.contacts_api.id
  resource_id = aws_api_gateway_resource.contacts_resource.id
  http_method = aws_api_gateway_method.post_contact.http_method

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.contacts_lambda.invoke_arn
}

resource "aws_api_gateway_integration" "lambda_integration_put" {
  rest_api_id = aws_api_gateway_rest_api.contacts_api.id
  resource_id = aws_api_gateway_resource.contact_item.id
  http_method = aws_api_gateway_method.put_contact.http_method

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.contacts_lambda.invoke_arn
}

resource "aws_api_gateway_integration" "lambda_integration_delete" {
  rest_api_id = aws_api_gateway_rest_api.contacts_api.id
  resource_id = aws_api_gateway_resource.contact_item.id
  http_method = aws_api_gateway_method.delete_contact.http_method

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.contacts_lambda.invoke_arn
}

resource "aws_lambda_permission" "allow_api_gateway" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.contacts_lambda.function_name
  principal     = "apigateway.amazonaws.com"

  # The source ARN for this permission is the ARN of the API Gateway
  source_arn = "${aws_api_gateway_rest_api.contacts_api.execution_arn}/*/*"
}

resource "aws_s3_bucket" "lambda_bucket" {
  bucket = "my-lambda-bucket-unique-12345" # Cambia a un nombre único
}

resource "aws_s3_bucket_object" "lambda_object" {
  bucket = aws_s3_bucket.lambda_bucket.id
  key    = "lambda.zip"
  source = "lambda.zip" # Asume que has creado un zip de tu función Lambda
}