import { defineConfig } from "drizzle-kit";

export default defineConfig({
    schema: "apps/eisenhower/src/db/schema.ts",
    out: "./migrations",
    dialect: "postgresql",
    dbCredentials: {
        host: "localhost",
        user: "postgres-effect",
        password: "postgres-effect",
        database: "postgres-effect",
        port: 5434,
    },
});
