import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as path from 'path';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';

export class KmsAutoRotateStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create a KMS key
    const kmsKey = new kms.Key(this, 'KMSKey', {
      alias: 'alias/cmk-30-day-auto-rotate',
      description: 'CMK with 30-day auto-rotation',
    });


    // Define the Lambda function for rotating the KMS key
    const rotateKeyLambda = new lambda.Function(this, 'RotateKeyFunction', {
      runtime: lambda.Runtime.PYTHON_3_12,
      functionName: 'rotate-kms-key',
      handler: 'rotate_kms_key.rotate_key',
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambda')),
      timeout: cdk.Duration.seconds(30),
    });

    // Attach necessary permissions to the Lambda function
    rotateKeyLambda.addToRolePolicy(new iam.PolicyStatement({
      actions: [
        'kms:RotateKeyOnDemand',
        'kms:ListKeyRotations'
      ],
      resources: [kmsKey.keyArn]
    }));

    // Create EventBridge rule to trigger the Lambda function on a schedule
    new events.Rule(this, 'ScheduleRule', {
      ruleName: '30-day-cmk-rotation-schedule',
      schedule: events.Schedule.rate(cdk.Duration.days(30)), // Schedule the rotation every 30 days
      targets: [new targets.LambdaFunction(rotateKeyLambda)],
      eventPattern: {
        source: ['aws.events'],
        detailType: ['Scheduled Event'],
        detail: {
          KMS_KEY_ID: [kmsKey.keyId]
        }
      }
    });

  }
}
