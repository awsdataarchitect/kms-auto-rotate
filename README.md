# Open-source demo project implementation of KMS Key Rotation Using AWS CDK, EventBridge, and Lambda Function

This is a CDK project written in TypeScript to demo how to implement KMS Key Rotation on a custom schedule using AWS-CDK.

# Architecture Diagram
![Alt text](./kms-auto-rotate.png?raw=true "Automating KMS Key Rotation Using AWS CDK, EventBridge, and Lambda Function")

For more details on how to deploy the infrastructure and the solution details, please refer to the [Blog Post](https://medium.com/@vivek-aws/automating-kms-key-rotation-using-aws-cdk-eventbridge-and-lambda-function-3a3838034be8).


The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `npx cdk deploy`  deploy this stack to your default AWS account/region
* `npx cdk diff`    compare deployed stack with current state
* `npx cdk synth`   emits the synthesized CloudFormation template
