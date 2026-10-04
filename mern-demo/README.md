# MERN demo

## Configure MongoDB

Create `server/.env` from the example and set `MONGODB_URI` to the connection
string for your MongoDB deployment:

```sh
cp server/.env.example server/.env
```

Use a MongoDB database user in the URI and URL-encode any special characters in
its password. In MongoDB Atlas, also allow connections from the machine running
Docker under **Network Access**.

Both Compose files load `server/.env` into the backend container. Do not put
database credentials in a Compose file or commit `server/.env`.

## GitHub Codespaces with Docker Hub

The Hub Compose backend uses host networking so it can use the DNS resolver
provided to the Codespace. In Codespaces, the bridge-network DNS may return
`ESERVFAIL` for Atlas SRV records, and public DNS servers may not be reachable
from containers. The backend listens directly on port `5000`; publish that port
in the Codespaces **Ports** tab if it is not detected automatically.

## Run with Docker Hub images

The backend image must contain the version of the application that reads
`MONGODB_URI`. Build and publish it, then pull and start the Hub Compose stack:

```sh
docker build -t hungtranthien/mern-backend:1.0 ./server
docker push hungtranthien/mern-backend:1.0
docker compose -f docker-compose.hub.yml pull backend
docker compose -f docker-compose.hub.yml up -d
```

To build and run the application locally instead, use:

```sh
docker compose up --build
```
