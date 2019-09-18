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