'use server';
import { auth } from '@/auth/auth';
import { db } from '@/lib/db';

// Define the type for the footer data
interface FooterProps {
	address: string;
	officeHours: string;
	massHours: string;
	contactPhone: string;
	contactEmail: string;
	instagram: string;
	twitter: string;
	facebook: string;
	youtube: string;
	blikPhoneNumber: string;
	bankAccountNumber: string;
	bankAccountName: string;
}

// Function to handle saving footer data
const saveFooterData = async (data: FooterProps) => {
	const session = await auth();

	if (!session) {
		return { error: 'Twoja sesja nie istnieje!' };
	}

	if (!session?.user?.role?.includes('admin')) {
		return {
			error: 'Nie masz permisji do dodawania postów',
		};
	}
	try {
		await db.footer.update({
			where: { id: '1' },
			data: data,
		});

		return { message: 'Footer updated successfully' };
	} catch (error) {
		const prismaError = error as { code?: string };

		if (prismaError?.code === 'P2022') {
			await db.$executeRaw`
				UPDATE "Footer"
				SET address = ${data.address},
					"officeHours" = ${data.officeHours},
					"massHours" = ${data.massHours},
					"contactPhone" = ${data.contactPhone},
					"contactEmail" = ${data.contactEmail},
					instagram = ${data.instagram},
					twitter = ${data.twitter},
					facebook = ${data.facebook},
					youtube = ${data.youtube}
				WHERE id = '1'
			`;

			return {
				message:
					'Footer updated in legacy mode. Apply Prisma migration to enable new payment fields.',
			};
		}

		console.error('Error saving data:', error);
		throw new Error('Error saving footer data');
	}
};

export default saveFooterData;
