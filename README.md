# K8s playground

This is a small demo application to use as a playground for kubernetes. It contains 2 microservices and an API gateway.

## Docs

The API is documented using Insomnia. See the public folder for more info.

## Run locally

You can run the services without docker or kubernetes. First do a `yarn install` and then open a terminal window for each service.

```sh
yarn run start:api
yarn run start:auth
yarn run start:pokedex
```

## Run in Kubernetes

```sh
./kube.sh install # Follow instructions at end of install
./kube.sh build
./kube.sh create
```

## Assignments

1. Get the other two microservices running in the cluster
1. Attach a larger `pokedex.json` to the pokedex service
1. Configure the HPA to use scale using a different metric
1. Supply the `users.json` via a Kubernetes Secret
1. Make the Kubernetes config files generic for each service by using variables (`{NAMESPACE}` and `{APP_NAME}`) and doing a `sed` replacement before applying them
1. Create a CI/CD script that automatically deploys this application to your cluster

# Acknowledgements

This project uses the pokedex data made available by Zeyi Fan at https://github.com/fanzeyi/pokemon.json as well as plenty of other open-source projects (as evidenced by the dependencies :)