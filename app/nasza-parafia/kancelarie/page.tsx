import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import findFooterData from '@/actions/findFooterData';

export default async function Kancelarie() {
	let footerData;

	try {
		footerData = await findFooterData();
	} catch (error) {
		console.error('Error fetching kancelarie data:', error);
		return <div>Error loading Kancelaria data</div>;
	}

	return (
		<main className="flex min-h-screen flex-col items-center bg-white">
			<MaxWidthWrapper className="flex flex-col items-center justify-center mt-7">
				<hr className="w-full mb-7" />
				<div className="flex flex-col max-w-fit w-[100ch] mb-14 gap-y-6">
					<h1 className="text-3xl font-bold text-center">Kancelaria parafialna</h1>
					<div dangerouslySetInnerHTML={{ __html: footerData.officeHours }} />
					<div>
						<h2 className="text-xl font-semibold">Kontakt</h2>
						<p>Telefon: {footerData.contactPhone}</p>
						<p>Email: {footerData.contactEmail}</p>
					</div>
					<div>
						<h2 className="text-xl font-semibold">Adres</h2>
						<p className="whitespace-pre-line">{footerData.address}</p>
					</div>
				</div>
				<hr className="w-full mt-7" />
			</MaxWidthWrapper>
		</main>
	);
}
