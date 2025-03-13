import postgres from "postgres";
import "dotenv/config";

/**
 * Clears and recreates databases by dropping and creating them again.
 *
 * This function:
 * 1. Connects to the PostgreSQL admin database using DATABASE_URL environment variable
 * 2. Drops the "web-dev-tools" and "test" databases if they exist
 * 3. Creates new empty versions of these databases
 * 4. Grants appropriate privileges to the postgres user
 *
 * @throws {Error} If DATABASE_URL is not set or if database operations fail
 * @returns {Promise<void>} Exits the process with code 0 on success, code 1 on failure
 */
async function clearDatabase() {
  // Make sure we have a database URL
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set in the environment variables");
    process.exit(1);
  }

  // Modify the connection URL to connect to postgres database instead
  const connectionString = process.env.DATABASE_URL.replace(
    /\/web-dev-tools($|\?)/,
    "/postgres$1"
  );
  console.log(`Connecting to admin database: ${connectionString}`);

  // Connect to the postgres database
  const client = postgres(connectionString);

  try {
    console.log(
      "Connected to postgres database. Preparing to drop and recreate target databases..."
    );

    // Now we can drop other databases safely
    await client.unsafe(`DROP DATABASE IF EXISTS "web-dev-tools" WITH (FORCE)`);
    await client.unsafe(`CREATE DATABASE "web-dev-tools"`);
    await client.unsafe(
      `GRANT ALL PRIVILEGES ON DATABASE "web-dev-tools" TO postgres`
    );

    await client.unsafe(`DROP DATABASE IF EXISTS "test" WITH (FORCE)`);
    await client.unsafe(`CREATE DATABASE "test"`);
    await client.unsafe(`GRANT ALL PRIVILEGES ON DATABASE "test" TO postgres`);

    console.log("Successfully cleared and recreated the databases.");
    process.exit(0); // Exit with success code
  } catch (error) {
    console.error("Error clearing database:", error);
    process.exit(1); // Exit with error code
  } finally {
    // Close the client before exiting
    await client.end();
  }
}

// Execute the function
clearDatabase();

/**
 * SQL equivalent commands:
 *
 * -- Standard SQL commands for database operations
 *
 * -- Drop and recreate the main database
 * DROP DATABASE IF EXISTS "web-dev-tools" WITH (FORCE);
 * CREATE DATABASE "web-dev-tools";
 * GRANT ALL PRIVILEGES ON DATABASE "web-dev-tools" TO some_username;
 *
 * -- Drop and recreate the test database
 * DROP DATABASE IF EXISTS "test" WITH (FORCE);
 * CREATE DATABASE "test";
 * GRANT ALL PRIVILEGES ON DATABASE "test" TO some_username;
 *
 * -- Note: The connection to the postgres administrative database
 * -- would need to be established through your client application
 * -- before running these commands.
 */
