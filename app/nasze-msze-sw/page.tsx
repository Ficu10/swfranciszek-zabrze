'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';

import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import { SafeHTML } from '@/components/SafeHTML';
import { Button } from '@/components/ui/button';

import findNaszeMszeSwData from '@/actions/findNaszeMszeSwData';
import saveNaszeMszeSwData from '@/actions/saveNaszeMszeSwData';

const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });

interface NaszeMszeSwProps {
	content: string;
}

export default function NaszeMszeSw() {
	const [data, setData] = useState<NaszeMszeSwProps | null>(null);
	const [loading, setLoading] = useState(true);
	const [isEditing, setIsEditing] = useState(false);
	const [editValues, setEditValues] = useState<NaszeMszeSwProps | null>(null);
	const { data: session } = useSession();

	useEffect(() => {
		const fetchData = async () => {
			try {
				const result = await findNaszeMszeSwData();
				setData({ content: result.content });
				setEditValues({ content: result.content });
			} catch (error) {
				console.error('Error fetching nasze msze data:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	const handleSave = async () => {
		if (!editValues) return;

		try {
			const result = await saveNaszeMszeSwData(editValues);
			if (result.success) {
				setData(editValues);
				setIsEditing(false);
			} else {
				alert('error' in result ? result.error : 'Failed to save changes');
			}
		} catch (error) {
			console.error('Error saving nasze msze data:', error);
			alert('Failed to save changes');
		}
	};

	if (loading) {
		return <div className="min-h-screen bg-white" />;
	}

	if (!data) {
		return <div>Error loading data</div>;
	}

	const isAdmin = session?.user?.role?.includes('admin');

	return (
		<main className="flex min-h-screen flex-col items-center justify-between bg-white relative overflow-hidden">
			<MaxWidthWrapper className="flex flex-col items-center justify-center mt-7">
				{isEditing ? (
					<div className="dangerouslySetInnerHTML w-full">
						<JoditEditor
							value={editValues?.content || ''}
							onChange={(newContent) => setEditValues({ content: newContent })}
							className="w-full p-4 border rounded min-h-screen"
						/>
					</div>
				) : (
					<>
						<hr className="w-full mb-7" />
						<SafeHTML
							content={data.content}
							className="dangerouslySetInnerHTML flex flex-col w-full mb-14"
							fallback="Content loading..."
						/>
						<hr className="w-full my-7" />
					</>
				)}

				{isAdmin && (
					<div className="mt-4 flex gap-2 my-7">
						{isEditing ? (
							<>
								<Button onClick={handleSave}>Zapisz</Button>
								<Button
									onClick={() => { setIsEditing(false); setEditValues(data); }}
									variant="destructive"
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
