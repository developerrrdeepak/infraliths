
'use client';

import { DollarSign, Clock, Users, Building, TrendingUp, Wallet } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { cn } from '@/lib/utils';
import { useAppContext } from '@/contexts/app-context';

const initialMockData = [
    { name: 'Jan', cost: 4000 },
    { name: 'Feb', cost: 3200 },
    { name: 'Mar', cost: 4800 },
    { name: 'Apr', cost: 7200 },
    { name: 'May', cost: 5800 },
    { name: 'Jun', cost: 8500 },
    { name: 'Jul', cost: 7100 },
];

export default function CostPrediction() {
    const { infralithResult } = useAppContext();
    const costData = infralithResult?.cost;

    const formatCurrency = (val: number) => {
        if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
        if (val >= 1000) return `$${(val / 1000).toFixed(0)}k`;
        return `$${val}`;
    };

    const metrics = [
        {
            title: 'Material Cost',
            val: costData ? formatCurrency(costData.breakdown.find(b => b.category === 'Materials')?.cost || 0) : '$1.2M',
            icon: Building,
            trend: '+5%',
            color: 'text-blue-500'
        },
        {
            title: 'Labor Cost',
            val: costData ? formatCurrency(costData.breakdown.find(b => b.category.includes('Labor'))?.cost || 0) : '$850k',
            icon: Users,
            trend: '-2%',
            color: 'text-green-500'
        },
        {
            title: 'Timeline',
            val: '14 mo',
            icon: Clock,
            trend: 'On Track',
            color: 'text-purple-500'
        },
        {
            title: 'Total Budget',
            val: costData ? formatCurrency(costData.totalEstimatedCost) : '$2.4M',
            icon: DollarSign,
            trend: '+3%',
            color: 'text-amber-500'
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold tracking-tight font-headline">Project Cost Prediction</h1>
                <p className="text-muted-foreground text-sm">
                    <span className="text-primary font-medium">Azure Machine Learning</span> forecast based on real-time market material rates.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {metrics.map((item, idx) => (
                    <Card key={idx} className="bg-card/20 backdrop-blur-md border-white/5 relative overflow-hidden">
                        <div className={cn("absolute top-0 right-0 p-4 opacity-10", item.color)}>
                            <item.icon className="h-12 w-12" />
                        </div>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xs font-bold uppercase tracking-wider opacity-60">{item.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold tracking-tight">{item.val}</div>
                            <div className="flex items-center gap-1.5 mt-1">
                                <Badge variant="outline" className={cn(
                                    "text-[10px] py-0 px-1.5 border-none bg-primary/5",
                                    item.trend.startsWith('+') ? "text-red-400" : item.trend.startsWith('-') ? "text-green-400" : "text-blue-400"
                                )}>
                                    {item.trend}
                                </Badge>
                                <span className="text-[10px] text-muted-foreground">vs. last month</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="bg-card/20 backdrop-blur-md border-white/5">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-lg">Expenditure Forecast</CardTitle>
                        <CardDescription className="text-xs">Projected monthly operational burn rate.</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <span className="h-2 w-2 rounded-full bg-primary" />
                            Actual
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <span className="h-2 w-2 rounded-full bg-primary/30" />
                            Forecast
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-4">
                    <div className="h-[320px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={initialMockData}>
                                <defs>
                                    <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis
                                    dataKey="name"
                                    stroke="#888888"
                                    fontSize={11}
                                    tickLine={false}
                                    axisLine={false}
                                    dy={10}
                                />
                                <YAxis
                                    stroke="#888888"
                                    fontSize={11}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `$${value / 1000}k`}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(0,0,0,0.8)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '8px',
                                        fontSize: '12px'
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="cost"
                                    stroke="var(--primary)"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorCost)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
                <Card className="bg-primary/5 border-primary/10">
                    <CardHeader className="py-4">
                        <CardTitle className="text-sm font-bold flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-primary" /> Market Insight
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pb-4">
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Steel prices are projected to rise by <span className="text-foreground font-semibold">12%</span> in the next quarter due to supply chain constraints. We recommend front-loading material procurement to lock in current rates.
                        </p>
                    </CardContent>
                </Card>
                <Card className="bg-primary/5 border-primary/10">
                    <CardHeader className="py-4">
                        <CardTitle className="text-sm font-bold flex items-center gap-2">
                            <Wallet className="h-4 w-4 text-primary" /> Budget Optimization
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pb-4">
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            AI analysis suggests a <span className="text-foreground font-semibold">{(costData?.totalEstimatedCost || 1500000) * 0.03}</span> saving potential by optimizing heavy machinery lease schedules during the structural phase.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
