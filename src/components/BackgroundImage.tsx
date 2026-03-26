"use client";

import { useEffect, useState } from 'react';

const images = [
	'/background/tlo_parafia.jpg',
	'/background/franciszek_2.png',
	'/background/franciszek_3.png',
];

const BackgroundImage = () => {
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const [failedImages, setFailedImages] = useState<string[]>([]);

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
			{images.map((imageUrl, imageIndex) => (
				<img
					key={imageUrl}
					src={imageUrl}
					alt="Tło parafii"
					onError={() => {
						setFailedImages((previousFailedImages) =>
							previousFailedImages.includes(imageUrl)
								? previousFailedImages
								: [...previousFailedImages, imageUrl]
						);
					}}
					className={`absolute inset-0 object-cover transition-opacity duration-1000 ${
						imageIndex === currentImageIndex ? 'opacity-100' : 'opacity-0'
					}`}
				/>
			))}

			<div className="absolute inset-0 bg-black/25" />

			<div className="absolute top-1/2 left-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 transform flex-col items-center justify-center gap-y-5 rounded-xl bg-slate-800/50 p-10 text-center text-white">
				<h2 className="text-6xl">Parafia św. Franciszka</h2>
				<hr className="w-1/2" />
				<h3 className="text-4xl">w Zabrzu</h3>
			</div>

			{failedImages.length > 0 && (
				<div className="absolute bottom-3 left-3 z-20 rounded bg-red-700/90 px-3 py-2 text-xs text-white">
					Błąd ładowania obrazów: {failedImages.length}
				</div>
			)}
		</div>
	);
};

export default BackgroundImage;
