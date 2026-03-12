'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import findFooterData from '@/actions/findFooterData';
import saveFooterData from '@/actions/saveFooterData';
import { Button } from '@/components/ui/button';

interface FooterProps {
	address: string;
	officeHours: string;
	contactPhone: string;
	contactEmail: string;
	instagram: string;
	twitter: string;
	facebook: string;
	youtube: string;
}

export default function Kancelarie() {
	const [footerData, setFooterData] = useState<FooterProps | null>(null);
	const [loading, setLoading] = useState(true);
	const [isEditing, setIsEditing] = useState(false);
	const [editValues, setEditValues] = useState<FooterProps | null>(null);
	const { data: session } = useSession();

	useEffect(() => {
		const fetchKancelarieData = async () => {
			try {
				const data = await findFooterData();
				setFooterData(data);
				setEditValues(data);
				setLoading(false);
			} catch (error) {
				console.error('Error fetching kancelarie data:', error);
				setLoading(false);
			}
		};

		fetchKancelarieData();
	}, []);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setEditValues((prevEditValues) =>
			prevEditValues ? { ...prevEditValues, [name]: value } : prevEditValues
		);
	};

	const handleSave = async () => {
		if (!editValues) return;

		try {
			const result = await saveFooterData(editValues);
			if ('error' in result) {
				alert(result.error);
				return;
			}

			setFooterData(editValues);
			setIsEditing(false);
		} catch (error) {
			console.error('Error saving kancelarie data:', error);
			alert('Failed to save changes');
		}
	};

	if (loading) {
		return <div className="min-h-screen bg-white" />;
	}

	if (!footerData || !editValues) {
		return <div>Error loading Kancelaria data</div>;
	}

	const roles = Array.isArray(session?.user?.role)
		? session.user.role
		: [(session?.user?.role as string | undefined)?.toString()];

	const isAdmin = roles.some((role) => typeof role === 'string' && role === 'admin');

	return (
		<main className="flex min-h-screen flex-col items-center bg-white">
			<MaxWidthWrapper className="flex flex-col items-center justify-center mt-7">
				<hr className="w-full mb-7" />
				<div className="flex flex-col max-w-fit w-[100ch] mb-14 gap-y-6">
					<h1 className="text-3xl font-bold text-center">Kancelaria parafialna</h1>

					<div>
						<h2 className="text-xl font-semibold">Godziny urzędowania</h2>
						{isEditing ? (
							<textarea
								name="officeHours"
								value={editValues.officeHours}
								onChange={handleChange}
								className="w-full border p-2 rounded"
								rows={8}
							/>
						) : (
							<div dangerouslySetInnerHTML={{ __html: footerData.officeHours }} />
						)}
					</div>

					<div>
						<h2 className="text-xl font-semibold">Kontakt</h2>
						{isEditing ? (
							<div className="flex flex-col gap-2 mt-2">
								<input
									name="contactPhone"
									value={editValues.contactPhone}
									onChange={handleChange}
									className="w-full border p-2 rounded"
								/>
								<input
									name="contactEmail"
									value={editValues.contactEmail}
									onChange={handleChange}
									className="w-full border p-2 rounded"
								/>
							</div>
						) : (
							<>
								<p>Telefon: {footerData.contactPhone}</p>
								<p>Email: {footerData.contactEmail}</p>
							</>
						)}
					</div>

					<div>
						<h2 className="text-xl font-semibold">Adres</h2>
						{isEditing ? (
							<textarea
								name="address"
								value={editValues.address}
								onChange={handleChange}
								className="w-full border p-2 rounded"
								rows={4}
							/>
						) : (
							<p className="whitespace-pre-line">{footerData.address}</p>
						)}
					</div>

					{isAdmin && (
						<div className="mt-4 flex gap-2">
							{isEditing ? (
								<>
									<Button onClick={handleSave}>Zapisz</Button>
									<Button onClick={() => setIsEditing(false)} variant={'destructive'}>
										Odrzuć
									</Button>
								</>
							) : (
								<Button onClick={() => setIsEditing(true)}>Edytuj</Button>
							)}
						</div>
					)}
				</div>
				<hr className="w-full mt-7" />
			</MaxWidthWrapper>
		</main>
	);
}
