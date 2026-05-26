'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import {
	AreaChart,
	Area,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from 'recharts';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import { FaUsers } from 'react-icons/fa';

type Range = '1d' | '7d' | '30d' | '12m';

const RANGES: { label: string; value: Range }[] = [
	{ label: 'Dziś', value: '1d' },
	{ label: '7 dni', value: '7d' },
	{ label: '30 dni', value: '30d' },
	{ label: '12 mies.', value: '12m' },
];

interface ChartPoint {
	label: string;
	count: number;
}

export default function VisitorCounter() {
	const { data: session } = useSession();
	const [todayCount, setTodayCount] = useState<number | null>(null);
	const [open, setOpen] = useState(false);
	const [range, setRange] = useState<Range>('7d');
	const [chartData, setChartData] = useState<ChartPoint[]>([]);
	const [loading, setLoading] = useState(false);

	const isAdmin = session?.user?.role?.includes('admin');

	// Fetch just today's count for the badge
	useEffect(() => {
		if (!isAdmin) return;
		fetch('/api/visit-stats?range=1d')
			.then((r) => r.json())
			.then((d) => setTodayCount(d.todayCount ?? 0))
			.catch(() => setTodayCount(0));
	}, [isAdmin]);

	const fetchStats = useCallback(
		(r: Range) => {
			if (!isAdmin) return;
			setLoading(true);
			fetch(`/api/visit-stats?range=${r}`)
				.then((res) => res.json())
				.then((d) => {
					setChartData(d.chartData ?? []);
					setTodayCount(d.todayCount ?? 0);
				})
				.catch(() => {})
				.finally(() => setLoading(false));
		},
		[isAdmin]
	);

	useEffect(() => {
		if (open) fetchStats(range);
	}, [open, range, fetchStats]);

	if (!isAdmin) return null;

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<button className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 hover:bg-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition-colors">
					<FaUsers className="text-base text-slate-500" />
					<span>
						{todayCount !== null ? (
							<>
								<span className="font-bold text-slate-900">{todayCount}</span>
								<span className="text-slate-500 ml-1 text-xs">dziś</span>
							</>
						) : (
							<span className="text-slate-400">…</span>
						)}
					</span>
				</button>
			</PopoverTrigger>
			<PopoverContent
				className="w-[420px] p-4"
				align="end"
				sideOffset={8}
			>
				<div className="mb-3 flex items-center justify-between">
					<h3 className="font-semibold text-sm text-slate-800">
						Odwiedziny strony
					</h3>
					<div className="flex gap-1">
						{RANGES.map((r) => (
							<Button
								key={r.value}
								variant={range === r.value ? 'default' : 'outline'}
								size="sm"
								className="h-7 px-2 text-xs"
								onClick={() => setRange(r.value)}
							>
								{r.label}
							</Button>
						))}
					</div>
				</div>

				{loading ? (
					<div className="h-48 flex items-center justify-center text-slate-400 text-sm">
						Ładowanie…
					</div>
				) : (
					<ResponsiveContainer width="100%" height={180}>
						<AreaChart
							data={chartData}
							margin={{ top: 4, right: 4, bottom: 0, left: -10 }}
						>
							<defs>
								<linearGradient id="visitGradient" x1="0" y1="0" x2="0" y2="1">
									<stop offset="5%" stopColor="#1d4ed8" stopOpacity={0.25} />
									<stop offset="95%" stopColor="#1d4ed8" stopOpacity={0} />
								</linearGradient>
							</defs>
							<CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
							<XAxis
								dataKey="label"
								tick={{ fontSize: 10, fill: '#94a3b8' }}
								axisLine={false}
								tickLine={false}
								interval="preserveStartEnd"
							/>
							<YAxis
								allowDecimals={false}
								tick={{ fontSize: 10, fill: '#94a3b8' }}
								axisLine={false}
								tickLine={false}
							/>
							<Tooltip
								contentStyle={{
									fontSize: 12,
									borderRadius: 6,
									border: '1px solid #e2e8f0',
									boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
								}}
								formatter={(v: number | string | undefined) => [v ?? 0, 'Odwiedziny']}
							/>
							<Area
								type="monotone"
								dataKey="count"
								stroke="#1d4ed8"
								strokeWidth={2}
								fill="url(#visitGradient)"
								dot={false}
								activeDot={{ r: 4, fill: '#1d4ed8' }}
							/>
						</AreaChart>
					</ResponsiveContainer>
				)}

				<p className="mt-3 text-xs text-slate-400 text-right">
					Tylko widoczne dla administratorów
				</p>
			</PopoverContent>
		</Popover>
	);
}
