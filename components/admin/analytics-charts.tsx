"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface AnalyticsData {
    dailyVolume: { date: string; amount: number }[]
    userGrowth: { date: string; users: number }[]
    statusDistribution: { name: string; value: number }[]
}

export default function AnalyticsCharts({ data }: { data: AnalyticsData }) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Transaction Volume Chart */}
            <Card className="bg-white border-slate-200 shadow-sm rounded-[2rem] p-6 lg:col-span-2">
                <CardHeader>
                    <CardTitle className="text-lg font-black text-slate-900">Transaction Volume (Last 30 Days)</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.dailyVolume}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis
                                    dataKey="date"
                                    tickLine={false}
                                    axisLine={false}
                                    fontSize={12}
                                    tickMargin={10}
                                    stroke="#94a3b8"
                                />
                                <YAxis
                                    tickLine={false}
                                    axisLine={false}
                                    fontSize={12}
                                    stroke="#94a3b8"
                                    tickFormatter={(value) => `$${value}`}
                                />
                                <Tooltip
                                    cursor={{ fill: 'rgba(99, 102, 241, 0.1)' }}
                                    contentStyle={{
                                        backgroundColor: '#fff',
                                        borderRadius: '12px',
                                        border: '1px solid #e2e8f0',
                                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                    }}
                                />
                                <Bar
                                    dataKey="amount"
                                    fill="#4f46e5"
                                    radius={[4, 4, 0, 0]}
                                    barSize={30}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* User Growth Chart */}
            <Card className="bg-white border-slate-200 shadow-sm rounded-[2rem] p-6">
                <CardHeader>
                    <CardTitle className="text-lg font-black text-slate-900">User Growth</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data.userGrowth}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis
                                    dataKey="date"
                                    tickLine={false}
                                    axisLine={false}
                                    fontSize={12}
                                    stroke="#94a3b8"
                                />
                                <YAxis
                                    tickLine={false}
                                    axisLine={false}
                                    fontSize={12}
                                    stroke="#94a3b8"
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#fff',
                                        borderRadius: '12px',
                                        border: '1px solid #e2e8f0',
                                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="users"
                                    stroke="#8b5cf6"
                                    strokeWidth={3}
                                    dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4, stroke: '#fff' }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Status Distribution (Placeholder for now) */}
            <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-none shadow-sm rounded-[2rem] p-6 text-white">
                <CardHeader>
                    <CardTitle className="text-lg font-black text-white">System Efficiency</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {data.statusDistribution.map((item, i) => (
                            <div key={i}>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium text-slate-300">{item.name}</span>
                                    <span className="text-sm font-bold">{item.value}%</span>
                                </div>
                                <Progress value={item.value} className="h-2 bg-slate-700" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
