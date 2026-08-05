import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
	const passwordHash = await bcrypt.hash("password123", 10);

	const owner = await prisma.user.create({
		data: {
			email: "owner1@printflow.dev",
			passwordHash,
		},
	});

	const shop = await prisma.shop.create({
		data: {
			name: "Sagar Xerox",
			slug: "sagar-xerox",
			ownerId: owner.id,
		},
	});

	console.log("Seeded:", { email: owner.email, shopSlug: shop.slug });
	console.log("Password for all seeded users: password123");
}

main()
	.catch(console.error)
	.finally(() => prisma.$disconnect());
