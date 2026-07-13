import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "../prisma/schema.prisma",
  migrations: {
    path: "../prisma/migrations",
  },
  datasource: {
    url: "DATABASE_URL" in process.env?  process.env.DATABASE_URL:"file:./prisma/db.sqlite",
  },
});
