# Blog application

Posts are saved in the database. An article may include images. Admin can create new content using a form and edit the posts.

## How to run the application locally using Docker?

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

## Admin panel screenshots
![image](https://github.com/user-attachments/assets/19e34d1f-dc08-48e9-a601-a9a3102a0a36)
![image](https://github.com/user-attachments/assets/a7bf3bec-7866-4030-9134-674ab89f586b)
![image](https://github.com/user-attachments/assets/c05b66a4-39de-4253-be06-912d8832e7ee)

