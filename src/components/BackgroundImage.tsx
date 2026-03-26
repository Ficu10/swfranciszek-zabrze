"use client";

import { useEffect, useState } from 'react';

const images = [
	'/background/tlo_parafia.jpg',
	'/background/franciszek_2.png',
	'/background/franciszek_3.png',
];

const BackgroundImage = () => {
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const [failedImageCount, setFailedImageCount] = useState(0);

	useEffect(() => {
		const intervalId = setInterval(() => {
			setCurrentImageIndex((previousIndex) =>
				previousIndex === images.length - 1 ? 0 : previousIndex + 1
			);
		}, 5000);

		return () => clearInterval(intervalId);
	}, []);

	return (
		<div className="relative h-full w-full overflow-hidden rounded-xl bg-slate-900/50">
			<img
				src={images[currentImageIndex]}
				alt="Tło parafii"
				onError={() => {
					setFailedImageCount((previousValue) => previousValue + 1);
					setCurrentImageIndex((previousIndex) =>
						previousIndex === images.length - 1 ? 0 : previousIndex + 1
					);
				}}
				className="h-full w-full object-cover"
			/>

			<div className="absolute inset-0 bg-black/25" />

			<div className="absolute top-1/2 left-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 transform flex-col items-center justify-center gap-y-5 rounded-xl bg-slate-800/50 p-10 text-center text-white">
				<h2 className="text-6xl">Parafia św. Franciszka</h2>
				<hr className="w-1/2" />
				<h3 className="text-4xl">w Zabrzu</h3>
			</div>

			{failedImageCount > 0 && (
				<div className="absolute bottom-3 left-3 z-20 rounded bg-red-700/90 px-3 py-2 text-xs text-white">
					Błąd ładowania obrazu: {failedImageCount}
				</div>
			)}
		</div>
	);
};

export default BackgroundImage;
