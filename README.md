# Frontend

This project was developed by Eugenio Páez Casado.

## Previous considerations before frontend deployment

Please follow the README.md file in the project root directory to up backend docker

## Run dockerized frontend

Go to frontend directory and run these commands

docker build -t frontend:v1 .

docker run -d -v ${PWD}:/app -v /app/node_modules -p 4200:4200 --rm frontend:v1

Go to browser and open http://localhost:4200
