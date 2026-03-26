'use server';

import { db } from '@/lib/db';

type LegacyFooterRow = {
	id: string;
	address: string;
	officeHours: string;
	massHours: string;
	contactPhone: string;
	contactEmail: string;
	instagram: string;
	twitter: string;
	facebook: string;
	youtube: string;
};

const LEGACY_CONTACT_EMAIL = 'parafia@swfranciszekzabrze.pl';
const CURRENT_CONTACT_EMAIL = 'sf_zabrze@kuria.gliwice.pl';

const normalizeContactEmail = (email: string) => {
	if (email?.trim().toLowerCase() === LEGACY_CONTACT_EMAIL) {
		return CURRENT_CONTACT_EMAIL;
	}

	return email;
};

const normalizeLegacyFooter = (footer: LegacyFooterRow) => ({
	...footer,
	contactEmail: normalizeContactEmail(footer.contactEmail),
	blikPhoneNumber: '',
	bankAccountNumber: '',
	bankAccountName: '',
});

async function findFooterData() {
	try {
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

		return {
			...footerData,
			contactEmail: normalizeContactEmail(footerData.contactEmail),
		};
	} catch (error) {
		const prismaError = error as { code?: string };

		if (prismaError?.code !== 'P2022') {
			throw error;
		}

		const legacyFooterRows = await db.$queryRaw<LegacyFooterRow[]>`
			SELECT id, address, "officeHours", "massHours", "contactPhone", "contactEmail", instagram, twitter, facebook, youtube
			FROM "Footer"
			WHERE id = '1'
			LIMIT 1
		`;

		const legacyFooter = legacyFooterRows[0];

		if (legacyFooter) {
			return normalizeLegacyFooter(legacyFooter);
		}

		await db.$executeRaw`
			INSERT INTO "Footer" (id, address, "officeHours", "massHours", "contactPhone", "contactEmail", instagram, twitter, facebook, youtube)
			VALUES ('1', '', '', '', '', '', '', '', '', '')
		`;

		return normalizeLegacyFooter({
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
		});
	}
}

export default findFooterData;
