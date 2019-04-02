## Ideas App backend API

### WORK IN PROGRESS! NOT DONE!

This is an API for an app I'm building. It's a repository for web development project ideas. Users can submit their ideas, or their attempts to execute an idea.

Uses [Express](https://github.com/expressjs/express), [Sequelize](https://github.com/sequelize/sequelize), [JSON web tokens](https://github.com/auth0/node-jsonwebtoken), and [bcrypt](https://github.com/kelektiv/node.bcrypt.js).

Install dependencies: `npm install`, start server in development: `npm run dev`. Needs a .env config file with DATABASE_NAME, DATABASE_USERNAME, DATABASE_PASSWORD, DATABASE_DIALECT, DATABASE_HOST, DATABASE_PORT, SECRET, PORT

All routes (except auth) check for JWT as "authorization" in request headers, it is required for all post requests but users should be able to view stuff without creating an account.

#### Authentication

Route | Method | Parameters | Description
----- | ------ | ---------- | -----------
`/auth/signup` | `POST` | email, username, password | Create a user
`/auth/signin` | `POST` | username, password | Sign a user in. Response contains JWT

#### Idea

Route | Method | Parameters | Description
----- | ------ | ---------- | -----------
`/idea/` | `GET` | none | Gets all the ideas as JSON array
`/idea/` | `POST` | title, short_description, description, difficulty | Creates an idea
`/idea/:slug` | `GET` | Include slug paramater. Slug is a property of an idea, it is generated on creation. | Gets an idea by the slug

#### Submission

Route | Method | Parameters | Description
----- | ------ | ---------- | -----------
`/submission/:idea_id` | `POST` | repo_link (required), live_link (optional), description, tags (ARRAY, optional), idea_id (on the query string) | Create a submission for an idea. Must pass the id for the idea as idea_id
`/submission/:idea_id` | `GET` | none | Get all submissions for an idea
`/submission/tags/:tag` | `GET` | tag | Submissions can have tags, and this route gets all submissions that have this tag

#### INCOMPLETE, much more to come