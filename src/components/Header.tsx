// Components
import Link from 'next/link';
import { FaYoutube } from 'react-icons/fa';

import Nav from './Nav';
import TopicSearch from './TopicSearch';

const Header = () => {
	return (
		<header className="bg-white py-10 relative z-50">
			<div className="mx-auto w-full max-w-screen-2xl px-2.5 md:px-20 space-y-4">
				<div className="mx-auto flex w-full max-w-3xl items-center gap-2">
					<div className="flex-1">
						<TopicSearch />
					</div>
					<Link
						href="https://www.youtube.com/watch?v=Q9MVF5YlDBU"
						target="_blank"
						rel="noopener noreferrer"
						className="inline-flex items-center gap-2 rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700"
					>
						<FaYoutube className="text-base" />
						<span>LIVE</span>
					</Link>
				</div>
				<Nav />
			</div>
		</header>
	);
};

export default Header;
