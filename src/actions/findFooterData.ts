'use server';

import { db } from '@/lib/db';

async function findFooterData() {
	const footerData = await db.footer.findUnique({
		where: { id: '1' },
	});

	if (!footerData) {
		const newFooter = await db.footer.create({
			data: {
				id: '1',
				address: '',
				officeHours: '',
				massHours: '',
				contactPhone: '',
				contactEmail: '',
				instagram: '',
				twitter: '',
				facebook: '',
				youtube: '',
				blikPhoneNumber: '',
				bankAccountNumber: '',
				bankAccountName: '',
			},
		});
		return newFooter;
	}

	return footerData;
}

export default findFooterData;
