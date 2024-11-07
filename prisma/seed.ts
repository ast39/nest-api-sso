import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
	await prisma.$transaction(async (prisma) => {
		await prisma.role.createMany({
			data: [
				{
					name: 'admin',
					description: 'Отдел управления',
				},
				{
					name: 'finance',
					description: 'Финансовый отдел',
				},
				{
					name: 'hr',
					description: 'Отдел кадров',
				},
				{
					name: 'support',
					description: 'Поддержка клиентов',
				},
			],
		});

		const newUser = await prisma.user.create({
			data: {
				login: 'ast',
				password: await bcrypt.hash('i2020aLeX', 10),
				name: 'Александр Сергеевич',
				position: 'CTO',
				isRoot: true,
				isBlocked: false,
			},
			select: { id: true },
		});

		const adminRole = await prisma.role.findUnique({
			where: { name: 'admin' },
			select: { id: true },
		});

		if (adminRole) {
			await prisma.userRole.create({
				data: {
					userId: newUser.id,
					roleId: adminRole.id,
				},
			});
		} else {
			throw new Error("Роль 'admin' не найдена");
		}
	});
}

main()
	.catch((e) => {
		console.error('Error seeding data: ', e);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
