import type { LoaderFunction, LinksFunction } from "remix";
import { Form } from "remix";
import { Outlet, useLoaderData, Link } from "remix";
import { db } from "~/utils/db.server";
// import type { User } from "@prisma/client";
// import { getUser } from "~/utils/session.server";
import stylesUrl from "../styles/jokes.css";

type LoaderData = {
  jokeListItems: Array<{ id: string; name: string }>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const jokeListItems = await db.joke.findMany({
    take: 5,
    select: { id: true, name: true },
    orderBy: { createdAt: "desc" },
  });
  const data: LoaderData = {
    jokeListItems,
  };

  return data;
};

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

export default function JokesScreen() {
  const data = useLoaderData<LoaderData>();

  return (
    <div className="jokes-layout">
      <header className="jokes-header">
        <div className="container">
          <h1 className="home-link">
            <Link to="/" title="Remix Jokes" aria-label="Remix Jokes">
              <span className="logo">🤪</span>
              <span className="logo-medium">J🤪KES</span>
            </Link>
          </h1>
        </div>
      </header>
      <main className="jokes-main">
        <div className="container">
          <div className="jokes-list">
            {data.jokeListItems.length ? (
              <>
                <Link to=".">Get a random joke</Link>
                <p>Here are a few more jokes to check out:</p>
                <ul>
                  {data.jokeListItems.map(({ id, name }) => (
                    <li key={id}>
                      <Link to={id} prefetch="intent">
                        {name}
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link to="new" className="button">
                  Add your own
                </Link>
              </>
            ) : null}
          </div>
          <div className="jokes-outlet">
            <Outlet />
          </div>
        </div>
      </main>
      <footer className="jokes-footer">
        <div className="container">
          <Link reloadDocument to="/jokes.rss">
            RSS
          </Link>
        </div>
      </footer>
    </div>
  );
}
