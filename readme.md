# Natours-API(V1.1)(ES6 syntax)

## :rocket: Installation :

If you want to test the API in your local machine, you need first to install dependecies and add env variables.

1. First run `npm i`.
2. Create a `.config.env` file in the root directory.
3. In `.config.env` :

   ```
      NODE_ENV=development
      PORT=3000

      URI_PASSWORD=<Your URI Atlas Password>
      ATLAS_URI=<Atlas URI>

      JWT_SECRET=<JWT Secret(Your choice)>
      JWT_EXPIRES_IN=90d
      JWT_COOKIE_EXPIRES_IN=90

      #Use [Mailtrap.io] to test mails
      EMAIL_USERNAME=<Your mailtrap username>
      EMAIL_PASSWORD=<Your mailtrap password>
      EMAIL_HOST=smtp.mailtrap.io
      EMAIL_PORT=2525
      EMAIL_FROM=test@example.com
   ```

4. Run `npm run import-dev-data` to run the script that will load the dev-data to your database.
5. Start the server `npm run dev`.

**Note** : If want to delete the dev-data from your DB run `npm run delete-dev-data`

## :books: API Documentation :

-[Natours API Docs](https://documenter.getpostman.com/view/12095324/T1DjkzV6)
