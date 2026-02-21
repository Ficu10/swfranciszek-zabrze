// Components

console.log('[HOME_PAGE] Loading home page...');

import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import BackgroundImage from '@/components/BackgroundImage';
import Cards from '@/components/Cards';

export default function Home() {
	console.log('[HOME_PAGE] Home component rendering');
	return (
		<main className="flex min-h-screen flex-col items-center justify-between bg-white relative overflow-hidden">
			<MaxWidthWrapper>
				<div className="w-full h-[650px]">
					<BackgroundImage />
				</div>
				<Cards />
			</MaxWidthWrapper>
		</main>
	);
}
