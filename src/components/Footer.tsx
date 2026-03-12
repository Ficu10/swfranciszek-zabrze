'use client';

import { useEffect, useState } from 'react';
import findFooterData from '@/actions/findFooterData';
import saveFooterData from '@/actions/saveFooterData';
import MaxWidthWrapper from './MaxWidthWrapper';
import { FaLocationDot } from 'react-icons/fa6';
import {
	FaPhone,
	FaFacebook,
	FaTwitter,
	FaYoutube,
	FaInstagram,
} from 'react-icons/fa';
import { HiMiniBuildingOffice } from 'react-icons/hi2';
import { IoMdMail, IoMdContact } from 'react-icons/io';
import { useSession } from 'next-auth/react';
import { BsBank } from 'react-icons/bs';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface FooterProps {
	address: string;
	officeHours: string;
	contactPhone: string;
	contactEmail: string;
	instagram: string;
	twitter: string;
	facebook: string;
	youtube: string;
}

const DEFAULT_FOOTER_VALUES: FooterProps = {
	address: 'Parafia św. Franciszka\nul. Wolności 446\n41-806 Zabrze',
	officeHours:
		'Poniedziałek: 8:00 - 9:00<br />Wtorek: 16:00 - 17:00<br />Środa: 8:00 - 9:00<br />Czwartek: 16:00 - 17:00<br />Piątek: 8:00 - 9:00',
	contactPhone: '+48 32 271 31 52',
	contactEmail: 'parafia@swfranciszekzabrze.pl',
	instagram: '',
	twitter: 'https://x.com/franciszek_zab',
	facebook: 'https://www.facebook.com/swfranciszekzabrze/?locale=pl_PL',
	youtube: 'https://www.youtube.com/channel/UCsoJROoNWSobb5hoR6kQ0mQ',
};

const getResolvedFooterData = (data: FooterProps): FooterProps => ({
	address: data.address?.trim() || DEFAULT_FOOTER_VALUES.address,
	officeHours: data.officeHours?.trim() || DEFAULT_FOOTER_VALUES.officeHours,
	contactPhone: data.contactPhone?.trim() || DEFAULT_FOOTER_VALUES.contactPhone,
	contactEmail: data.contactEmail?.trim() || DEFAULT_FOOTER_VALUES.contactEmail,
	instagram: data.instagram?.trim() || DEFAULT_FOOTER_VALUES.instagram,
	twitter: data.twitter?.trim() || DEFAULT_FOOTER_VALUES.twitter,
	facebook: data.facebook?.trim() || DEFAULT_FOOTER_VALUES.facebook,
	youtube: data.youtube?.trim() || DEFAULT_FOOTER_VALUES.youtube,
});

const Footer = () => {
	const [footerData, setFooterData] = useState<FooterProps | null>(null);
	const [loading, setLoading] = useState(true);
	const [isEditing, setIsEditing] = useState(false);
	const [editValues, setEditValues] = useState<FooterProps | null>(null);
	const { data: session } = useSession();

	const normalizeOfficeHoursForEditor = (value: string) =>
		value
			.replace(/<br\s*\/?>/gi, '\n')
			.replace(/<\/p>\s*<p>/gi, '\n')
			.replace(/<[^>]*>/g, '')
			.trim();

	const formatOfficeHoursForHtml = (value: string) =>
		value
			.split('\n')
			.map((line) => line.trim())
			.filter(Boolean)
			.join('<br />');

	useEffect(() => {
		const fetchFooterData = async () => {
			try {
				const data = await findFooterData();
				const resolvedData = getResolvedFooterData(data);
				setFooterData(resolvedData);
				setEditValues({
					...resolvedData,
					officeHours: normalizeOfficeHoursForEditor(resolvedData.officeHours),
				});
				setLoading(false);
			} catch (error) {
				console.error('Error fetching footer data:', error);
				setLoading(false);
				setFooterData(DEFAULT_FOOTER_VALUES);
				setEditValues({
					...DEFAULT_FOOTER_VALUES,
					officeHours: normalizeOfficeHoursForEditor(
						DEFAULT_FOOTER_VALUES.officeHours
					),
				});
			}
		};

		fetchFooterData();
	}, []);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setEditValues((prevEditValues) =>
			prevEditValues ? { ...prevEditValues, [name]: value } : prevEditValues
		);
	};

	const handleSave = async () => {
		if (!editValues) return;

		try {
			const payload = {
				...editValues,
				officeHours: formatOfficeHoursForHtml(editValues.officeHours),
			};

			const result = await saveFooterData(payload);
			if (result) {
				setFooterData(payload);
				setEditValues({
					...payload,
					officeHours: normalizeOfficeHoursForEditor(payload.officeHours),
				});
				setIsEditing(false);
			} else {
				alert('Failed to save changes');
			}
		} catch (error) {
			console.error('Error saving data:', error);
			alert('Failed to save changes');
		}
	};

	if (loading) {
		return <div></div>;
	}

	if (!footerData) {
		return <div>Error loading footer data</div>;
	}

	const socialLinks = [
		{ key: 'facebook', href: footerData.facebook, icon: FaFacebook },
		{ key: 'twitter', href: footerData.twitter, icon: FaTwitter },
		{ key: 'instagram', href: footerData.instagram, icon: FaInstagram },
		{ key: 'youtube', href: footerData.youtube, icon: FaYoutube },
	];

	return (
		<footer className="text-white p-6 pb-5 lg:p-10 lg:pb-5">
			<MaxWidthWrapper>
				<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 text-sm">
					<div className="rounded-xl border border-white/20 bg-slate-900/40 p-5 space-y-3">
						<div className="flex items-center gap-3">
							<FaLocationDot className="text-2xl text-white" />
							<h4 className="text-xl font-bold text-white">Adres parafii</h4>
						</div>
						<p className="whitespace-pre-line leading-relaxed text-gray-100">{footerData.address}</p>
					</div>

					<div className="rounded-xl border border-white/20 bg-slate-900/40 p-5 space-y-3">
						<div className="flex items-center gap-3">
							<HiMiniBuildingOffice className="text-2xl text-white" />
							<h4 className="text-xl font-bold text-white">Kancelaria parafialna</h4>
						</div>
						<div
							className="leading-relaxed text-gray-100"
							dangerouslySetInnerHTML={{ __html: footerData.officeHours }}
						/>
					</div>

					<div className="rounded-xl border border-white/20 bg-slate-900/40 p-5 space-y-3">
						<div className="flex items-center gap-3">
							<IoMdContact className="text-2xl text-white" />
							<h4 className="text-xl font-bold text-white">Kontakt</h4>
						</div>
						<div className="space-y-2 text-gray-100">
							<div className="flex items-center gap-2">
								<FaPhone className="text-lg text-white" />
								<span>{footerData.contactPhone}</span>
							</div>
							<div className="flex items-center gap-2">
								<IoMdMail className="text-lg text-white" />
								<span>{footerData.contactEmail}</span>
							</div>
						</div>
					</div>

					<div className="rounded-xl border border-white/20 bg-slate-900/40 p-5 space-y-3">
						<div className="flex items-center gap-3">
							<BsBank className="text-2xl text-white" />
							<h4 className="text-xl font-bold text-white">Konto parafialne</h4>
						</div>
						<div className="leading-relaxed text-gray-100">
							Orzesko - Knurowski Bank Spółdzielczy
							<br />
							34-8454-1082-2006-0023-9628-0001
						</div>
					</div>
				</div>

				{session?.user?.role?.includes('admin') && isEditing && editValues && (
					<div className="mt-8 rounded-xl border border-white/20 bg-white/10 p-5 space-y-4">
						<h4 className="text-xl font-bold">Edycja stopki</h4>
						<p className="text-sm text-white/80">
							Wpisuj każdą linię osobno. Dla godzin kancelarii użyj nowej linii
							dla kolejnego dnia.
						</p>

						<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
							<div className="space-y-2">
								<label className="text-sm font-semibold">Adres parafii</label>
								<textarea
									name="address"
									value={editValues.address}
									onChange={handleChange}
									rows={5}
									className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-black"
								/>
							</div>

							<div className="space-y-2">
								<label className="text-sm font-semibold">Godziny kancelarii</label>
								<textarea
									name="officeHours"
									value={editValues.officeHours}
									onChange={handleChange}
									rows={5}
									className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-black"
								/>
							</div>

							<div className="space-y-2">
								<label className="text-sm font-semibold">Telefon</label>
								<Input
									name="contactPhone"
									value={editValues.contactPhone}
									onChange={handleChange}
									className="text-black"
								/>
							</div>

							<div className="space-y-2">
								<label className="text-sm font-semibold">Email</label>
								<Input
									name="contactEmail"
									value={editValues.contactEmail}
									onChange={handleChange}
									className="text-black"
								/>
							</div>

							<div className="space-y-2">
								<label className="text-sm font-semibold">Facebook URL</label>
								<Input
									name="facebook"
									value={editValues.facebook}
									onChange={handleChange}
									className="text-black"
								/>
							</div>

							<div className="space-y-2">
								<label className="text-sm font-semibold">X/Twitter URL</label>
								<Input
									name="twitter"
									value={editValues.twitter}
									onChange={handleChange}
									className="text-black"
								/>
							</div>

							<div className="space-y-2">
								<label className="text-sm font-semibold">Instagram URL</label>
								<Input
									name="instagram"
									value={editValues.instagram}
									onChange={handleChange}
									className="text-black"
								/>
							</div>

							<div className="space-y-2">
								<label className="text-sm font-semibold">YouTube URL</label>
								<Input
									name="youtube"
									value={editValues.youtube}
									onChange={handleChange}
									className="text-black"
								/>
							</div>
						</div>

						<div className="flex gap-2 pt-2">
							<Button onClick={handleSave}>Zapisz</Button>
							<Button
								onClick={() => {
									setIsEditing(false);
									setEditValues({
										...footerData,
										officeHours: normalizeOfficeHoursForEditor(
											footerData.officeHours
										),
									});
								}}
								variant="destructive"
							>
								Anuluj
							</Button>
						</div>
					</div>
				)}

				<div className="flex flex-col lg:flex-row mt-10 justify-between items-center gap-4">
					<p className="text-left text-md flex items-center">
						&copy; Parafia św. Franciszka w Zabrzu
					</p>
					<div className="flex justify-evenly lg:items-center lg:gap-x-4">
						{socialLinks
							.filter((link) => Boolean(link.href))
							.map((link) => {
								const Icon = link.icon;
								return (
									<a
										key={link.key}
										href={link.href}
										target="_blank"
										rel="noopener noreferrer"
									>
										<Icon className="text-2xl text-white hover:text-gray-300 transition-colors" />
									</a>
								);
							})}
						{socialLinks.every((link) => !link.href) && (
							<span className="text-sm text-white/70">Brak linków społecznościowych</span>
						)}
					</div>
				</div>

				{session?.user?.role?.includes('admin') && !isEditing && (
					<div className="mt-6 flex justify-center">
						<Button onClick={() => setIsEditing(true)}>Edytuj stopkę</Button>
					</div>
				)}
			</MaxWidthWrapper>
		</footer>
	);
};

export default Footer;
