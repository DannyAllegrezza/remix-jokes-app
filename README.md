# Welcome to Remix!

- [Remix Docs](https://remix.run/docs)

## Development

From your terminal:

```sh
npm run dev
```

This starts your app in development mode, rebuilding assets on file changes.

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `remix build`

- `build/`
- `public/build/`

### Using a Template

When you ran `npx create-remix@latest` there were a few choices for hosting. You can run that again to create a new project, then copy over your `app/` folder to the new project that's pre-configured for your target server.

```sh
cd ..
# create a new project, and pick a pre-configured host
npx create-remix@latest
cd my-new-remix-app
# remove the new project's app (not the old one!)
rm -rf app
# copy your app over
cp -R ../my-old-remix-app/app app
```


## Project Structure and Remix conventions

- `app/` - This is where all your Remix app code goes
- `app/entry.client.tsx` - This is the first bit of your JavaScript that will run when the app loads in the browser. We use this file to [hydrate](https://reactjs.org/docs/react-dom.html#hydrate) our React components.
- `app/entry.server.tsx` - This is the first bit of your JavaScript that will run when a request hits your server. Remix handles loading all the necessary data and you're responsible for sending back the response. We'll use this file to render our React app to a string/stream and send that as our response to the client.
- `app/root.tsx` - This is where we put the root component for our application. You render the `<html>` element here.
- `app/routes/` - This is where all your "route modules" will go. Remix uses the files in this directory to create the URL routes for your app based on the name of the files.
- `public/` - This is where your static assets go (images/fonts/etc)
- `remix.config.js` - Remix has a handful of configuration options you can set in this file.

## This app's Routes

Here are all the routes our app is going to have:

| Route            	| Description                                        	|
|------------------	|----------------------------------------------------	|
| `/`              	| The index route of the app                         	|
| `/jokes`         	| Displays 10 latest jokes                           	|
| `/jokes/:jokeId` 	| Display an individual joke                         	|
| `/jokes/new`     	| 🔐: Allows authenticated users to create a new joke 	|
| `/login`         	| Allows unauthenticated users to login to our app   	|

You can programmatically create routes via the `remix.config.js`, but the more common way to create the routes is through the file system. This is called "file-based routing."

Each file we put in the app/routes directory is called a "Route Module" and by following the route filename convention, we can create the routing URL structure we're looking for. Remix uses React Router under the hood to handle this routing.

> For more information, see ["Route Filenames"](https://remix.run/docs/en/v1.1.1/api/conventions#route-filenames) on the Remix docs!

# Database

This project uses `prisma`, a JavaScript ORM. To run the initial migrations, run:

`npx prisma db push`

This will read our config from our `.env` file, read the Prisma schema from `prisma/schema.prisma`, and create the database at `prisma/dev.db` (we are using SQLite).

## Loading the seed data

We created a file to seed our joke data (`prisma/seed.ts`), which contains a function to generate some jokes and then `INSERT` them into the database. 

```ts
async function seed() {
  await Promise.all(
    getJokes().map((joke) => {
      // db is the Prisma client. We have type support for our schema, so we have `.joke` available. The .create() function performs the INSERT
      return db.joke.create({ data: joke });
    })
  );
}
```

Since this is a `.ts` file, we run it via the `node --require esbuild-register prisma/seed.ts` command

### A note about the connection
The .server part of the filename informs Remix that this code should never end up in the browser. This is optional, because Remix does a good job of ensuring server code doesn't end up in the client. But sometimes some server-only dependencies are difficult to treeshake, so adding the .server to the filename is a hint to the compiler to not worry about this module or its imports when bundling for the browser. The .server acts as a sort of boundary for the compiler.