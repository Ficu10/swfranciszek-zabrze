'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';

import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import { SafeHTML } from '@/components/SafeHTML';
import { Button } from '@/components/ui/button';

import findMszeSwWZabrzuData from '@/actions/findMszeSwWZabrzuData';
import saveMszeSwWZabrzuData from '@/actions/saveMszeSwWZabrzuData';

const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });

interface MszeSwWZabrzuProps {
	content: string;
}

export default function MszeSwWZabrzu() {
	const [mszeData, setMszeData] = useState<MszeSwWZabrzuProps | null>(null);
	const [loading, setLoading] = useState(true);
	const [isEditing, setIsEditing] = useState(false);
	const [editValues, setEditValues] = useState<MszeSwWZabrzuProps | null>(null);
	const { data: session } = useSession();

	useEffect(() => {
		const fetchMszeData = async () => {
			try {
				const data = await findMszeSwWZabrzuData();
				setMszeData(data);
				setEditValues(data);
				setLoading(false);
			} catch (error) {
				console.error('Error fetching MszeSwWZabrzu data:', error);
				setLoading(false);
			}
		};

		fetchMszeData();
	}, []);

	const handleContentChange = (newContent: string) => {
		setEditValues((prevEditValues) =>
			prevEditValues
				? { ...prevEditValues, content: newContent }
				: prevEditValues
		);
	};

	const handleSave = async () => {
		if (!editValues) return;

		try {
			const result = await saveMszeSwWZabrzuData(editValues);
			if (result.success) {
				setMszeData(editValues);
				setIsEditing(false);
				alert('message' in result ? result.message : 'Changes saved successfully');
			} else {
				alert('error' in result ? result.error : 'Failed to save changes');
			}
		} catch (error) {
			console.error('Error saving data:', error);
			alert('Failed to save changes');
		}
	};

	if (loading) {
		return <div className="min-h-screen bg-white" />;
	}

	if (!mszeData) {
		return <div>Error loading Msze święte data</div>;
	}

	return (
		<main className="flex min-h-screen flex-col items-center justify-between bg-white relative overflow-hidden">
			<MaxWidthWrapper className="flex flex-col items-center justify-center mt-7">
				{isEditing ? (
					<>
						<div className="dangerouslySetInnerHTML">
							<JoditEditor
								value={editValues?.content || ''}
								onChange={handleContentChange}
								className="w-full p-4 border rounded min-h-screen"
							/>
						</div>
					</>
				) : (
					<>
						<hr className="w-full mb-7" />
						<SafeHTML
							content={mszeData.content}
							className="dangerouslySetInnerHTML flex flex-col w-full mb-14 overflow-x-auto"
							fallback="Content loading..."
						/>
						<hr className="w-full my-7" />
					</>
				)}
				{session?.user?.role?.includes('admin') && (
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
