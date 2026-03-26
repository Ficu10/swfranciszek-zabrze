// Components

import Nav from './Nav';
import TopicSearch from './TopicSearch';

const Header = () => {
	return (
		<header className="bg-white py-10 relative z-50">
			<div className="mx-auto w-full max-w-screen-2xl px-2.5 md:px-20 space-y-4">
				<div className="flex justify-center">
					<TopicSearch />
				</div>
				<Nav />
			</div>
		</header>
	);
};

export default Header;
