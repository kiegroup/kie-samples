package main

import (
	"fmt"
	"os"

	"github.com/kiegroup/kogito-serverless-operator/workflowproj"
)

func main() {
	// we are ignoring errors just for demo purposes, but don't do this!
	workflowFile, _ := os.Open("../order.sw.json")
	propertiesFile, _ := os.Open("../application.properties")
	specFile, _ := os.Open("../specs/supplier.yaml")
	defer workflowFile.Close()
	defer propertiesFile.Close()
	defer specFile.Close()

	// create the handler
	handler := workflowproj.New("kogito-workflows").
		WithWorkflow(workflowFile).
		WithAppProperties(propertiesFile).
		AddResource("supplier.yaml", specFile)

	// Let's produce the Kubernetes manifests
	err := handler.SaveAsKubernetesManifests("./resources")
	if err != nil {
		fmt.Println("Error saving Kubernetes manifests")
		panic(err)
	}
}
