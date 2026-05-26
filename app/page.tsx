// Components

import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import BackgroundImage from '@/components/BackgroundImage';
import Cards from '@/components/Cards';

// Force server rendering to avoid static generation issues
export const dynamic = 'force-dynamic';

export default function Home() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-between bg-white relative overflow-hidden">
			<MaxWidthWrapper>
				<div className="relative z-20 -mb-16 flex justify-center px-4 pt-6 sm:pt-10">
					<div className="rounded-xl bg-slate-800/80 px-6 py-4 text-center text-white shadow-2xl backdrop-blur-sm sm:px-10 sm:py-5">
						<h2 className="text-3xl font-semibold sm:text-5xl">
							Parafia św. Franciszka
						</h2>
						<p className="mt-2 text-xl sm:text-3xl">w Zabrzu</p>
					</div>
				</div>
				<div className="w-full h-[650px]">
					<BackgroundImage />
				</div>
				<Cards />
			</MaxWidthWrapper>
		</main>
	);
}
