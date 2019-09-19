#!/bin/bash
set -e

case "$1" in
  install )
    set +e
    if which minikube > /dev/null; then
      echo "Minikube already installed"
    else
      brew install kubectl && brew cask install docker minikube virtualbox
    fi

    minikube start
    eval $(minikube docker-env)

    if docker ps | grep registry:2 > /dev/null; then
      echo "Registry already running"
    else
      docker run -d -p 5000:5000 --restart=always --name registry registry:2
    fi
    set -e

    echo ''
    echo 'Minikube has been started and a registry container spun up'
    echo 'Run this command to configure your shell: '
    echo '   eval $(docker-machine env -u)'
    echo 'Run this command to configure your DNS for k8s-playground: '
    echo '   echo "$(minikube ip) playground.local" | sudo tee -a /etc/hosts'
    ;;
  build )
    VERSION="$2"
    if [ "$2" == "" ]; then
      echo "Missing VERSION!"
      exit 1
    fi
    docker build . --tag pokedex
    docker tag pokedex localhost:5000/pokedex:$VERSION
    docker push localhost:5000/pokedex:$VERSION
    ;;
  create )
    kubectl apply -f k8s/namespace.yml
    kubectl apply -f k8s/apiGatewayConfigmap.yml
    kubectl apply -f k8s/apiGatewayDeployment.yml
    kubectl apply -f k8s/apiGatewayHPA.yml
    kubectl apply -f k8s/apiGatewayService.yml
    kubectl apply -f k8s/ingress.yml
    ;;
  destroy )
    kubectl delete -f k8s/namespace.yml
    ;;
  boot )
    minikube start
    minikube docker-env
    ;;
  shutdown )
    minikube stop
    docker-machine env -u
    ;;
  * )
    echo "Available commands: "
    echo ""
    echo "    install           Install and start minikube"
    echo "    boot              Starts minikube"
    echo "    shutdown          Stops minikube"
    echo '    build $VERSION    Builds and pushes docker image to local registry with version'
    echo "    create            Creates kubernetes resources on minikube"
    echo "    destroy           Deletes kubernetes resources on minikube"
    exit 1;
    ;;
esac