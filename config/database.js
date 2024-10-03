const path = require("path");

module.exports = ({ env }) => {
  // Set the default client to 'postgres'
  const client = env("DATABASE_CLIENT", "postgres");

  const connections = {
    mysql: {
      connection: {
        host: env("DATABASE_HOST", "localhost"),
        port: env.int("DATABASE_PORT", 3306),
        database: env("DATABASE_NAME", "strapi"),
        user: env("DATABASE_USERNAME", "strapi"),
        password: env("DATABASE_PASSWORD", "strapi"),
        ssl: env.bool("DATABASE_SSL", false) && {
          key: env("DATABASE_SSL_KEY", undefined),
          cert: env("DATABASE_SSL_CERT", undefined),
          ca: env("DATABASE_SSL_CA", undefined),
          capath: env("DATABASE_SSL_CAPATH", undefined),
          cipher: env("DATABASE_SSL_CIPHER", undefined),
          rejectUnauthorized: env.bool(
            "DATABASE_SSL_REJECT_UNAUTHORIZED",
            true
          ),
        },
      },
      pool: {
        min: env.int("DATABASE_POOL_MIN", 2),
        max: env.int("DATABASE_POOL_MAX", 10),
      },
    },
    postgres: {
      connection: {
        connectionString: env(
          "DATABASE_URL",
          "postgresql://postgres:LJguRlKtgvbRbsSJKrjFllkeNgAcssMY@postgres-53pj.railway.internal:5432/railway"
        ),
        host: env("PGHOST", "postgres-53pj.railway.internal"), // Use environment variable for host
        port: env.int("PGPORT", 5432), // Use environment variable for port
        database: env("PGDATABASE", "railway"), // Use environment variable for database name
        user: env("PGUSER", "postgres"), // Use environment variable for username
        password: env("PGPASSWORD", "LJguRlKtgvbRbsSJKrjFllkeNgAcssMY"), // Use environment variable for password
        ssl: {
          rejectUnauthorized: env.bool("DATABASE_SSL", true), // Set SSL to true for production
        },
        schema: env("DATABASE_SCHEMA", "public"), // Default schema
      },
      pool: {
        min: env.int("DATABASE_POOL_MIN", 2),
        max: env.int("DATABASE_POOL_MAX", 10),
      },
    },
    sqlite: {
      connection: {
        filename: path.join(
          __dirname,
          "..",
          env("DATABASE_FILENAME", ".tmp/data.db")
        ),
      },
      useNullAsDefault: true,
    },
  };

  return {
    connection: {
      client,
      ...connections[client],
      acquireConnectionTimeout: env.int("DATABASE_CONNECTION_TIMEOUT", 60000),
    },
  };
};
