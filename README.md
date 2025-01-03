# Blog application

You can fill in the form. The fields will be saved in the database. A post may include images. Admin can view the added data and edit the form submissions.

## How to run the application using Docker?

Create a `.env` file based on the `.env.example` file with filled values. Run the following commands in the terminal (project root directory):

- production version:
  - `docker-compose build` - build the image
  - `docker-compose up` - run the application
- development version:

  - `docker-compose -f docker-compose-dev.yml build`
  - `docker-compose -f docker-compose-dev.yml up`.

## GitHub actions

- E2E tests - run daily in the production using Cypress, can be triggered manually
- Database Backup - SQL file of a Postgres dump is sent to Google Cloud Storage

## Database migrations

- Create a new migration without applying it: `npm run migration:draft`
- Apply the edited migration: `npm run migration:dev`
- Changes are applied automatically to a production database when deploying the application (build command)
