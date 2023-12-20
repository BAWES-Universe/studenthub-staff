### Genrate ngsw.json

`./node_modules/.bin/ngsw-config ./www/<project-name> ./src/ngsw-config.json [/base/href]`

### Sample for localhost

`./node_modules/.bin/ngsw-config ./www ./src/ngsw-config.json http://localhost/studenthub-staff/www/`

todo

- forms with datetime field need to test 
- test whole app 
- ability to use algolia key with expiry 
- refresh functionality in instant search need to test

** Docker 

To run in container 

`docker compose up`

** Build and Deploy using Dockerfile

To build a Docker Image, we have to run the following command in our terminal:

`docker build -t <image-name>:<tag-name> .`

To run the built docker image, use the following command:

`docker run -d --publish 3000:80 --name <image-name> --network <your local ip> <image-name>:<tag-name>`

To run container 

`docker run -d --publish 3000:80 <image-name>`

To access in browser 

`http://localhost:3000`

For ionic serve command, replace port 3000 with 8100 

For more commands follow the link 

https://raw.githubusercontent.com/sangam14/dockercheatsheets/master/dockercheatsheet8.png

To fix heap limit error 

`export NODE_OPTIONS=--max_old_space_size=20480`

