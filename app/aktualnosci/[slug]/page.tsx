import findPostBySlug from '@/actions/findPostBySlug';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import { notFound } from 'next/navigation';
import { IoPerson } from 'react-icons/io5';
import { FaCalendar } from 'react-icons/fa';

interface PostDetailsPageProps {
	params: Promise<{ slug: string }>;
}

export default async function PostDetailsPage({ params }: PostDetailsPageProps) {
	const { slug } = await params;
	const post = await findPostBySlug(slug);

	if (!post) {
		notFound();
	}

	return (
		<main className="flex min-h-screen flex-col items-center justify-between bg-white relative overflow-hidden">
			<MaxWidthWrapper className="flex flex-col items-center justify-center mt-7">
				<hr className="w-full mb-7" />
				<div className="flex flex-col w-full items-left jusify-center">
					<h1 className="text-3xl font-bold text-left w-full">{post.title}</h1>
					<p className="flex items-center gap-x-2 text-gray-600 mt-3">
						<IoPerson />
						{post.author} <FaCalendar />
						{new Date(post.createdAt).toLocaleDateString('pl-PL')}
					</p>
					<hr className="w-full my-7" />
				</div>
				<div
					className="dangerouslySetInnerHTML flex flex-col max-w-fit w-[100ch] mb-14"
					dangerouslySetInnerHTML={{
						__html: post.content,
					}}
				></div>
				<hr className="w-full mb-7" />
			</MaxWidthWrapper>
		</main>
	);
}
