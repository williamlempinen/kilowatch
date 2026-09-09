# Development documentation

## Technology stack

The project uses Java and Spring Boot on the backend and React with TypeScript on the frontend.
Other relevant technologies and libraries include:

- Maven
- TanStack Query
- Tailwind CSS
- Vite and Vitest
- Playwright
- Prettier and ESLint
- Docker and docker-compose

## Running the project

The best way to start the project in development setup is to start it with docker. This can be accomplished by running the command:

```shell
docker compose -f docker-compose.yml up --build
```

This expects that docker is installed to your machine.
Successful execution of the command will start the backend service on port 8888 and the frontend service on port 3333.
The web application can be accessed by opening the URL `http://localhost:3333/statistics` in your browser.

## KW-SERVICE

The project uses _Java_ with version of 21.0.7 _Temurin_ flavor. If you have **sdkman** installed, you can enable the
correct _Java_ version by running command `sdk env install` in the directory where `.sdkmanrc` file is located.

Running the `kw-service` can be accomplished with the command of `mvn spring-boot:run`

For code formatting, the `kw-service` uses `.editorconfig`

### Tests

Tests can be run with the command `mvn test` in the `kw-service` directory.

The integration tests uses _Testcontainers_ to spin up a Postgres database. This database is loaded with test data set located in: `kw-service/src/test/resources/data.sql`.

## KW-WEB

The web project uses _Node_ with version of _v24.14.1_ (current lts). If you have **nvm** installed, you can enable the
correct _Node_ version by running command `nvm install` in the directory where `.nvmrc` file is located.

To setup environment variables for development, copy the `kw-web/.env.example` into new `.env` file and set the `VITE_API_URL` variable to the backend service URL.
For example, if you are running the backend service locally, you can set it to `http://localhost:8888`. This step is not needed for docker setup.

Running the `kw-web` can be accomplished with the command of `npm run dev` which starts the frontend with _dev build_.

For formatting, the `kw-web` uses _Prettier_ and _ESLint_. The configuration files are located in the root of the project.
Both can be activated with following commands:

```shell
# linting
npm run lint
# formatting
npm run format
```

### Tests

Tests can be run with the command `npm run test` in the `kw-web` directory.
This project does not have component tests.

## E2E Tests

The project uses _Playwright_ for e2e testing. The tests are located in the `kw-web/e2e` directory. The suggested way of
running the tests is though _Docker_ and _docker-compose_. The tests can be run by executing the following command in
the root of the project:

```bash
./run-e2e.sh
```

which will build the docker images and run the tests. The tests can also be run without _Docker_ by executing the
following command in the `kw-web` directory:

```bash
npx playwright test
```

but this requires the services to be self started before elsewhere.

## Workflows

The project uses two workflows that are triggered when pull requests or pushes are made to **main** branch. These workflows build and tests the application for quality assurance.
