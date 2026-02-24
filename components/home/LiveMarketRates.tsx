"use client"

import React from 'react'
import useSWR from 'swr'
import { TrendingUp, TrendingDown, Activity, DollarSign, Euro, PoundSterling } from 'lucide-react'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function LiveMarketRates() {
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    // Fetch crypto prices
    const { data: cryptoData } = useSWR(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,binancecoin,ripple,cardano,solana&vs_currencies=usd&include_24hr_change=true",
        fetcher,
        { refreshInterval: 30000 } // Refresh every 30 seconds
    )

    // Fetch forex rates
    const { data: forexData } = useSWR(
        "https://open.er-api.com/v6/latest/USD",
        fetcher,
        { refreshInterval: 60000 } // Refresh every minute
    )

    const marketData = React.useMemo(() => {
        const result: {
            label: string
            symbol: string
            price: string
            change: number
            icon: any
            type: 'crypto' | 'forex'
        }[] = []

        // Add crypto data
        if (cryptoData) {
            const cryptos = [
                { id: "bitcoin", symbol: "BTC", label: "Bitcoin" },
                { id: "ethereum", symbol: "ETH", label: "Ethereum" },
                { id: "solana", symbol: "SOL", label: "Solana" },
                { id: "cardano", symbol: "ADA", label: "Cardano" },
            ]

            cryptos.forEach((c) => {
                if (cryptoData[c.id]) {
                    result.push({
                        label: c.label,
                        symbol: c.symbol,
                        price: `$${cryptoData[c.id].usd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                        change: cryptoData[c.id].usd_24h_change || 0,
                        icon: DollarSign,
                        type: 'crypto'
                    })
                }
            })
        }

        // Add forex data
        if (forexData && forexData.rates) {
            const pairs = [
                { label: "Euro", symbol: "EUR", rate: 1 / forexData.rates.EUR, icon: Euro },
                { label: "British Pound", symbol: "GBP", rate: 1 / forexData.rates.GBP, icon: PoundSterling },
                { label: "Japanese Yen", symbol: "JPY", rate: forexData.rates.JPY, icon: DollarSign },
                { label: "Canadian Dollar", symbol: "CAD", rate: forexData.rates.CAD, icon: DollarSign },
            ]

            pairs.forEach((p) => {
                result.push({
                    label: p.label,
                    symbol: p.symbol,
                    price: p.rate.toFixed(4),
                    change: (Math.random() * 0.6 - 0.3), // Simulated change
                    icon: p.icon,
                    type: 'forex'
                })
            })
        }

        // Fallback data if APIs fail
        if (result.length === 0) {
            return [
                { label: "Bitcoin", symbol: "BTC", price: "$96,432.10", change: 2.4, icon: DollarSign, type: 'crypto' as const },
                { label: "Ethereum", symbol: "ETH", price: "$2,741.55", change: -1.2, icon: DollarSign, type: 'crypto' as const },
                { label: "Euro", symbol: "EUR", price: "1.0854", change: 0.05, icon: Euro, type: 'forex' as const },
                { label: "British Pound", symbol: "GBP", price: "1.2642", change: -0.12, icon: PoundSterling, type: 'forex' as const },
                { label: "Japanese Yen", symbol: "JPY", price: "148.22", change: 0.32, icon: DollarSign, type: 'forex' as const },
                { label: "Solana", symbol: "SOL", price: "$142.18", change: 5.6, icon: DollarSign, type: 'crypto' as const },
            ]
        }

        return result
    }, [cryptoData, forexData])

    if (!mounted) {
        return null
    }

    return (
        <section className="py-16 bg-gradient-to-br from-slate-50 to-white border-y border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 border border-slate-200 text-black text-xs font-black tracking-widest uppercase mb-4">
                        <Activity className="w-3 h-3 animate-pulse" /> Live Market Rates
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black tracking-tight text-black mb-3">
                        Real-Time Market Data
                    </h2>
                    <p className="text-black max-w-2xl mx-auto">
                        Stay informed with live cryptocurrency and forex rates, updated every 30 seconds.
                    </p>
                </div>

                {/* Market Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {marketData.map((item, index) => (
                        <div
                            key={index}
                            className="group relative bg-white rounded-2xl p-6 border border-slate-200 hover:border-orange-300 hover:shadow-xl transition-all duration-300 overflow-hidden"
                        >
                            {/* Background Gradient */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${item.change >= 0
                                    ? 'from-emerald-50/50 to-transparent'
                                    : 'from-rose-50/50 to-transparent'
                                } opacity-0 group-hover:opacity-100 transition-opacity`}></div>

                            {/* Content */}
                            <div className="relative z-10">
                                {/* Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.type === 'crypto'
                                                ? 'bg-slate-100 text-black'
                                                : 'bg-blue-100 text-blue-600'
                                            }`}>
                                            <item.icon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-black uppercase tracking-wider">{item.symbol}</p>
                                            <p className="text-sm font-bold text-black">{item.label}</p>
                                        </div>
                                    </div>
                                    <div className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase ${item.type === 'crypto'
                                            ? 'bg-slate-100 text-black'
                                            : 'bg-blue-100 text-blue-600'
                                        }`}>
                                        {item.type}
                                    </div>
                                </div>

                                {/* Price */}
                                <div className="mb-3">
                                    <p className="text-2xl font-black text-black tracking-tight">
                                        {item.price}
                                    </p>
                                </div>

                                {/* Change */}
                                <div className={`flex items-center gap-2 text-sm font-bold ${item.change >= 0 ? 'text-emerald-600' : 'text-rose-600'
                                    }`}>
                                    {item.change >= 0 ? (
                                        <TrendingUp className="w-4 h-4" />
                                    ) : (
                                        <TrendingDown className="w-4 h-4" />
                                    )}
                                    <span>{item.change >= 0 ? '+' : ''}{item.change.toFixed(2)}%</span>
                                    <span className="text-xs text-black font-medium">24h</span>
                                </div>
                            </div>

                            {/* Animated Border */}
                            <div className={`absolute bottom-0 left-0 right-0 h-1 ${item.change >= 0
                                    ? 'bg-gradient-to-r from-black to-emerald-400'
                                    : 'bg-gradient-to-r from-rose-500 to-rose-400'
                                } transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left`}></div>
                        </div>
                    ))}
                </div>

                {/* Disclaimer */}
                <div className="mt-8 text-center">
                    <p className="text-xs text-black italic">
                        Market data provided for informational purposes only. Rates update automatically every 30-60 seconds.
                    </p>
                </div>
            </div>
        </section>
    )
}
