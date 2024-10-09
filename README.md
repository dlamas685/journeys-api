<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

## Description

This project defines the RESTful API of a trip and route optimization system. The API is based on the NestJS framework.

## Installation and running the app

1.  Clone the repository.
2.  Install the dependencies with the following command: `npm install`
3.  Execute prisma migrations with: `npx prisma migrate dev`
4.  Create a **.env** file in the root of the project. The file is based on the **.env.template** file.
5.  Execute docker compose: `docker compose up -d`.
6.  Run the app with the following command:

    - Development mode:

    ```bash
      # no watch mode
      $ npm run start

      # watch mode
      $ npm run start:dev
    ```

    - Production mode:

    ```bash
      $ npm run build
      $ npm run start:prod
    ```

## Workspace configuration

1.  Create a folder .vscode and a file settings.json in the root.
2.  Add the following configuration to the settings.json file:

    ```json
    {
    	"editor.formatOnSave": true,
    	"editor.codeActionsOnSave": {
    		"source.removeUnusedImports": "always",
    		"source.organizeImports": "always"
    	}
    }
    ```

## Swagger

The app has a swagger documentation. To access the documentation, go to the following URL: http://localhost:3001/docs

> [!NOTE]
> The port can be different. Check the **.env** file.

## Prisma CLI

After setup `.env` with database connections

- For update the types and reflect the schema changes
  ```
    npx prisma generate
  ```
- For sync all migrations run
  ```
    npx prisma migrate deploy
  ```
- For seed database
  ```
    npx prisma db seed
  ```
- Update schema and create migration
  ```
    npx prisma migrate dev --name example_name
  ```
