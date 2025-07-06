# Bun Boilerplate

This is a very basic boilerplate for starting a bun API. It includes:
1. Kysely database for Postgres.
2. Session based authentication.
3. Test context for writing tests.

To get started, you can clone the repo and then:
1. `bun install` to install the dependencies
2. `docker-compose up -d` to set up the database instances.
3. `bun test` will run the current tests.
4. `bun start` will start the API.

Utilities:
1. `bun run create:migration` create a new migration file for you.