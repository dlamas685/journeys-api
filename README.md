<p align="center">
  <a href="https://journeys-api.onrender.com/docs" target="blank">
    <img src="https://journeys-api.onrender.com/api/files/images/imagotype-v1.png" width="500" alt="Journeys" />
  </a>
</p>

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Passport](https://img.shields.io/badge/Passport-34E27A?style=for-the-badge&logo=passport&logoColor=white)
![BullMQ](https://img.shields.io/badge/BullMQ-E51B23?style=for-the-badge&logo=redis&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socketdotio&logoColor=white) 
![Google Maps API](https://img.shields.io/badge/Google_Maps-4285F4?style=for-the-badge&logo=googlemaps&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)
![Nodemailer](https://img.shields.io/badge/Nodemailer-0073E6?style=for-the-badge&logo=maildotru&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)
![Prettier](https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)


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
- For sync all migrations and seeds run
  ```
    npx prisma migrate deploy
  ```
- For sync only migrations run
  ```
    npx prisma migrate dev
    npx prisma generate
  ```
- For seed database
  ```
    npx prisma db seed
  ```
- Update schema and create migration
  ```
    npx prisma migrate dev --name example_name
  ```
