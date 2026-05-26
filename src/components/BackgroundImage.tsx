"use client";

import { useEffect, useState } from 'react';

const images = [
	'/background/tlo_parafia.jpg',
	'/background/franciszek_2.png',
	'/background/franciszek_3.png',
];

const BackgroundImage = () => {
	const [currentImageIndex, setCurrentImageIndex] = useState(0);

	useEffect(() => {
		const intervalId = setInterval(() => {
			setCurrentImageIndex((prev) => (prev + 1) % images.length);
		}, 5000);

		return () => clearInterval(intervalId);
	}, []);

	return (
		<div className="relative w-full overflow-hidden rounded-xl bg-slate-900" style={{ height: '650px' }}>
			{images.map((src, index) => (
				<img
					key={src}
					src={src}
					alt="Tło parafii"
					className="absolute inset-0 z-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out"
					style={{ opacity: index === currentImageIndex ? 1 : 0 }}
				/>
			))}

			<div className="absolute inset-0 z-10 bg-black/30" />
		</div>
	);
};

export default BackgroundImage;
