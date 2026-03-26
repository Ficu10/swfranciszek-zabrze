// Icons

import Link from 'next/link';
import { FaCross, FaNewspaper } from 'react-icons/fa';
import { FaMessage } from 'react-icons/fa6';

const Cards = () => {
	return (
		<div className="flex flex-col gap-y-8 lg:flex-row lg:justify-between items-center my-10">
			<Link href="/nasze-msze-sw">
				<div className="flex flex-col items-center justify-center pt-10 gap-y-5 w-[300px] h-[200px] shadow-[rgba(0,_0,_0,_0.25)_0px_25px_50px_-12px] hover:shadow-[rgba(13,_38,_76,_0.19)_0px_9px_20px]">
					<FaCross />
					<h2 className="2xl">Msze święte i Nabożeństwa</h2>
					<hr />
				</div>
			</Link>
			<Link href="/aktualnosci/ogloszenia-parafialne">
				<div className="flex flex-col items-center justify-center pt-10 gap-y-5 w-[300px] h-[200px] shadow-[rgba(0,_0,_0,_0.25)_0px_25px_50px_-12px] hover:shadow-[rgba(13,_38,_76,_0.19)_0px_9px_20px]">
					<FaNewspaper />
					<h2 className="2xl">Ogłoszenia</h2>
					<hr />
				</div>
			</Link>
			<Link href="/aktualnosci/intencje-mszalne">
				<div className="flex flex-col items-center justify-center pt-10 gap-y-5 w-[300px] h-[200px] shadow-[rgba(0,_0,_0,_0.25)_0px_25px_50px_-12px] hover:shadow-[rgba(13,_38,_76,_0.19)_0px_9px_20px]">
					<FaMessage />
					<h2 className="2xl">Intencje mszalne</h2>
					<hr />
				</div>
			</Link>
		</div>
	);
};

export default Cards;
