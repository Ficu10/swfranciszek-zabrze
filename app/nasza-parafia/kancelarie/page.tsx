'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import findFooterData from '@/actions/findFooterData';
import saveFooterData from '@/actions/saveFooterData';
import { Button } from '@/components/ui/button';
import dynamic from 'next/dynamic';

const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });

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
				const normalizedData: FooterProps = {
					...data,
					massHours: data.massHours ?? '',
				};
				setFooterData(normalizedData);
				setEditValues(normalizedData);
				setLoading(false);
			} catch (error) {
				console.error('Error fetching kancelarie data:', error);
				setLoading(false);
			}
		};

		fetchKancelarieData();
	}, []);

	const handleContentChange = (newContent: string) => {
		setEditValues((prevEditValues) =>
			prevEditValues
				? { ...prevEditValues, officeHours: newContent }
				: prevEditValues
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
		<main className="flex min-h-screen flex-col items-center justify-between bg-white relative overflow-hidden">
			<MaxWidthWrapper className="flex flex-col items-center justify-center mt-7">
				{isEditing ? (
					<>
						<div className="dangerouslySetInnerHTML">
							<JoditEditor
								value={editValues.officeHours || ''}
								onChange={handleContentChange}
								className="w-full p-4 border rounded min-h-screen"
							/>
						</div>
					</>
				) : (
					<>
						<hr className="w-full mb-7" />
						<div
							className="dangerouslySetInnerHTML flex flex-col max-w-fit w-[100ch] mb-14"
							dangerouslySetInnerHTML={{
								__html: footerData.officeHours,
							}}
						></div>
						<hr className="w-full my-7" />
					</>
				)}

					{isAdmin && (
						<div className="mt-4 flex gap-2 my-7">
							{isEditing ? (
								<>
									<Button onClick={handleSave}>Zapisz</Button>
									<Button
										onClick={() => setIsEditing(false)}
										variant={'destructive'}
									>
										Odrzuć
									</Button>
								</>
							) : (
								<Button onClick={() => setIsEditing(true)}>Edytuj</Button>
							)}
						</div>
					)}
			</MaxWidthWrapper>
		</main>
	);
}
