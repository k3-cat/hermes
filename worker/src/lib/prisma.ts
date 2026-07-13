import { PrismaClient } from "#/prisma/.gen/client";
import { PrismaD1} from '@prisma/adapter-d1'
import { env } from "cloudflare:workers";

const prismaClient = {
  async create() {
    const adapter = new PrismaD1(env.DB_D1)
		const prisma = new PrismaClient({ adapter })

		return prisma;
  },
}

export default prismaClient
