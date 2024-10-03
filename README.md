# Forms application

You can fill in the form. The fields will be saved in the database. A post may include images. Admin can view the added data and edit the form submissions.

## How to run the application using Docker?

Run the following commands in the terminal (project root directory):

- production version:
  - `docker-compose build` - build the image
  - `docker-compose up` - run the application
- development version:

  - `docker-compose -f docker-compose-dev.yml build`
  - `docker-compose -f docker-compose-dev.yml up`.
