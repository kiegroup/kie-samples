# Run this example on the Serverless Operator

## Prerequisites

In order to execute this example on hte Serverless  Operator [visit our official documentation](https://kiegroup.github.io/kogito-docs/serverlessworkflow/latest/cloud/operator/install-serverless-operator.html) to know how to install the operator in your Kubernetes cluster.

## Use the generated CR files

In the [resources](./resources/) directory you can find the CR that you need in order to deploy this workflow on your cluster in dev mode.

You need only to apply these resources using the following commands:
```bash
kubectl create namespace kogito-workflows
kubectl apply -f ./resources/ -n kogito-workflows
```

## Update the CR files

If you would like to recreate the CR files because you updated the workflow definition and you need to do it, you can do it executing the following commands:

```bash
go run main.go
kubectl apply -f ./resources/ -n kogito-workflows
```

