import MaxWidthWrapper from '@/components/MaxWidthWrapper';

interface PermissionDeniedProps {
	title?: string;
	message: string;
}

export default function PermissionDenied({
	title = 'Brak uprawnień',
	message,
}: PermissionDeniedProps) {
	return (
		<div className="flex min-h-screen flex-col items-center bg-white relative overflow-hidden">
			<MaxWidthWrapper className="flex flex-col items-center justify-center mt-7 gap-y-4 text-center">
				<h1 className="text-3xl font-bold">{title}</h1>
				<p className="max-w-2xl text-muted-foreground">{message}</p>
			</MaxWidthWrapper>
		</div>
	);
}
