# Project Title

ACME Corp, project tracking APIs.

### Application Design desicions

- The application is built on MVC design pattern for fast development and clean & maintanable code.
- Application is using Redis to cache the redundant data, which makes application ~25-30 times faster and less error prone.
- Have used appropriate custom error class, in order to catch any error occurs in any of the APIs.
- Logging is done using winston with timestamps, so developers get to know what and when the error occured.
- Proper test coverage is done using mocha/chai. All the edge cases are tested.

###

The apllication is built using Node.js and mongoDB database. Pakages used in application:

```
express: For creating API listner/server
mongoose: Connecting to mongoDB database
redis-client: caching the employee data
winston: For logging errors.
mocha/chai: testing framework of JS.
```

## Getting Started

`git clone https://github.com/rakeshsinha31/ACME-CORP-API.git`

Clone the repo to local machine and navigate to the ACME-CORP-API folder. Create a `.env` file at application root folder and set env variables.

```
API_VERSION=V1
REDIS_HOST=localhost
REDIS_PORT=6379
DATABASE_URI="mongodb://mongo:27017"
EMPLOYEES_URI= `Add employee service API URL`
TEST_SRVER_URL=http://localhost:3000
```

### Setup

- Running aplication in docker container (Recommended):

  - Install docker & docker-compose

    - [Docker] (https://docs.docker.com/compose/install/) - The application, DB and redis servers runs in docker container.

    * Once docker-compose is install, make sure .env file is created and values(listed above) are present.
    * run command: `docker-compose -f docker-compose.yml up`
    * Application will start on localhost at port, defined in .env file, default port is 3000.

  - Running application without docker:

    - node >= 14.15.4 and npm >= 6.14, should be installed.
    - mongoDB and Redis shuld be installed.
    - make sure .env file is created and values(listed above) are present.
    - navigate to application root folder and run command `npm install` , it will install all the dependencies.
    - run command: `npm start`

  - APIS are now ready to test on `http://localhost:port` Any REST client such as Postman, Insomnia, nodejs Rest Client, etc can be used to test the APIs.

## Running the tests

Navigate to the application rot folder and run below command:

```
npm run test
```

## Deployment

- For deployment in production (Docker):
  Set environment variables (listed above) as per cloud plateform , `AWS`, `GCP`, `digitalocean`, etc.
  The Docker image of application along wth dependency could be downloaded from dockerhub: - [Docker Image] <URL>
  - Docker swarm or Kuberetes can be used for deployment.

## Acknowledgments
