#!/usr/bin/env bash
set -eo pipefail
# more bash-friendly output for jq
JQ="jq --raw-output --exit-status"

deploy_cluster() {

    make_task_def
    register_definition

    if [[ $(aws ecs update-service --cluster $ECS_CLUSTER_NAME --service $ECS_SERVICE_NAME --task-definition $revision | \
                   $JQ '.service.taskDefinition') != $revision ]]; then
        echo "Error updating service."
        return 1
    fi

    # wait for older revisions to disappear
    # not really necessary, but nice for demos
    for attempt in {1..30}; do
        if stale=$(aws ecs describe-services --cluster $ECS_CLUSTER_NAME --services $ECS_SERVICE_NAME | \
                       $JQ ".services[0].deployments | .[] | select(.taskDefinition != \"$revision\") | .taskDefinition"); then
            echo "Waiting for stale deployment(s):"
            echo "$stale"
            sleep 30
        else
            echo "Deployed!"
            return 0
        fi
    done
    echo "Service update took too long - please check the status of the deployment on the AWS ECS console"
    return 1
}

make_task_def(){
	task_template='[
		{
			"name": "%s",
			"image": "%s.dkr.ecr.%s.amazonaws.com/%s:%s",
			"essential": true,
			"logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/aws/ecs/itc-helper-crawler",
          "awslogs-region": "ap-northeast-2",
          "awslogs-stream-prefix": "crawler"
        }
      },
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "${NODE_ENV}"
        },
        {
          "name": "DYNAMODB_TABLE_ACCESS_TOKEN",
          "value":  "${DYNAMODB_TABLE_ACCESS_TOKEN}"
        },
        {
          "name": "DYNAMODB_TABLE_REFRESH_TOKEN",
          "value":  "${DYNAMODB_TABLE_ACCESS_TOKEN}"
        },
        {
          "name": "DYNAMODB_TABLE_AUTHORIZATION_CODE",
          "value":  "${DYNAMODB_TABLE_AUTHORIZATION_CODE}"
        },
        {
          "name": "DYNAMODB_TABLE_USER",
          "value":  "${DYNAMODB_TABLE_USER}"
        },
        {
          "name": "DYNAMODB_TABLE_REPORT",
          "value":  "${DYNAMODB_TABLE_REPORT}"
        },
        {
          "name": "DYNAMODB_TABLE_DEPARTMENT",
          "value":  "${DYNAMODB_TABLE_DEPARTMENT}"
        },
        {
          "name": "SQS_QUEUE_URL",
          "value":  "${SQS_QUEUE_URL}"
        },
        {
          "name": "KMS_KEY_ID",
          "value":  "${KMS_KEY_ID}"
        },
        {
          "name": "SECRET_KEY",
          "value": "${SECRET_KEY}"
        },
        {
          "name": "PUPPETEER_CLUSTER_HEADLESS",
          "value": "${PUPPETEER_CLUSTER_HEADLESS}"
        },
        {
          "name": "PUPPETEER_CLUSTER_MONITOR",
          "value": "${PUPPETEER_CLUSTER_MONITOR}"
        }
      ]
		}
	]'

   	task_def=$(printf "$task_template" $ECS_CONTAINER_DEFINITION_NAME $AWS_ACCOUNT_ID $AWS_DEFAULT_REGION $ECR_REPOSITORY_NAME $CIRCLE_SHA1)
}

register_definition() {

    if revision=$(aws ecs register-task-definition --requires-compatibilities FARGATE --cpu 1024 --memory 2048 --network-mode awsvpc --execution-role-arn $EXECUTION_ROLE_ARN --task-role-arn $EXECUTION_ROLE_ARN --container-definitions "$task_def" --family $ECS_TASK_FAMILY_NAME | $JQ '.taskDefinition.taskDefinitionArn'); then
        echo "New deployment: $revision"
    else
        echo "Failed to register task definition"
        return 1
    fi

}

deploy_cluster