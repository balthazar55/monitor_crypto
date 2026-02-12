import { Injectable, signal, WritableSignal, OnDestroy } from '@angular/core';
import { interval, Subscription } from 'rxjs';

export interface SimulatedCryptoAsset {
    id: string;
    name: string;
    symbol: string;
    price: number;
    changePercent: number;
    previousPrice: number;
    ma50: number;
    volume: number;
    priceHistory: number[];
    icon: string;
}

@Injectable({
    providedIn: 'root'
})
export class SimulatedCryptoService implements OnDestroy {
    readonly rawPrices: WritableSignal<SimulatedCryptoAsset[]> = signal([]);

    private subscription: Subscription | null = null;
    private readonly UPDATE_INTERVAL_MS = 200;
    private readonly HISTORY_LENGTH = 20; // Points for sparkline

    // Solo 6 activos (eliminados los 2 de menor valor: DOGE y ADA)
    private assets: SimulatedCryptoAsset[] = [
        {
            id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC',
            price: 45083.44, changePercent: -0.649, previousPrice: 45083.44,
            ma50: 45166.69, volume: 232.2375, priceHistory: [], icon: 'bitcoin'
        },
        {
            id: 'ethereum', name: 'Ethereum', symbol: 'ETH',
            price: 3029.43, changePercent: 1.479, previousPrice: 3029.43,
            ma50: 3012.78, volume: 17.2899, priceHistory: [], icon: 'ethereum'
        },
        {
            id: 'solana', name: 'Solana', symbol: 'SOL',
            price: 99.95, changePercent: -0.17, previousPrice: 99.95,
            ma50: 100.14, volume: 0.3890, priceHistory: [], icon: 'solana'
        },
        {
            id: 'cardano', name: 'Cardano', symbol: 'ADA',
            price: 0.50, changePercent: 0.655, previousPrice: 0.50,
            ma50: 0.50, volume: 0.0020, priceHistory: [], icon: 'cardano'
        },
        {
            id: 'bnb', name: 'BNB', symbol: 'BNB',
            price: 320, changePercent: 0, previousPrice: 320,
            ma50: 318.50, volume: 1.2500, priceHistory: [], icon: 'bnb'
        },
        {
            id: 'ripple', name: 'Ripple', symbol: 'XRP',
            price: 0.52, changePercent: 0, previousPrice: 0.52,
            ma50: 0.51, volume: 0.0150, priceHistory: [], icon: 'ripple'
        }
    ];

    constructor() {
        this.initializePriceHistory();
        this.startSimulation();
    }

    private initializePriceHistory(): void {
        // Generar historial inicial de precios para sparklines
        this.assets = this.assets.map(asset => {
            const history: number[] = [];
            let price = asset.price;
            for (let i = 0; i < this.HISTORY_LENGTH; i++) {
                const variation = (Math.random() - 0.5) * 0.02 * price;
                price = price + variation;
                history.push(price);
            }
            history[history.length - 1] = asset.price; // Último es el precio actual
            return { ...asset, priceHistory: history };
        });
    }

    private startSimulation(): void {
        this.subscription = interval(this.UPDATE_INTERVAL_MS).subscribe(() => {
            this.updatePrices();
        });
        this.rawPrices.set([...this.assets]);
    }

    private updatePrices(): void {
        this.assets = this.assets.map(asset => {
            const previousPrice = asset.price;
            const volatility = this.getVolatilityFactor(asset.id);
            const changeMultiplier = (Math.random() - 0.5) * 2 * volatility;
            const newPrice = asset.price * (1 + changeMultiplier / 100);

            const basePrice = this.getBasePrice(asset.id);
            const changePercent = ((newPrice - basePrice) / basePrice) * 100;

            // Actualizar historial para sparkline (sliding window)
            const newHistory = [...asset.priceHistory.slice(1), newPrice];

            // Calcular MA50 simulado (promedio del historial)
            const ma50 = newHistory.reduce((a, b) => a + b, 0) / newHistory.length;

            // Simular volumen con variación
            const volumeChange = (Math.random() - 0.5) * 0.1 * asset.volume;
            const volume = Math.max(0.001, asset.volume + volumeChange);

            return {
                ...asset,
                previousPrice,
                price: Math.max(0.001, newPrice),
                changePercent: parseFloat(changePercent.toFixed(3)),
                priceHistory: newHistory,
                ma50: parseFloat(ma50.toFixed(2)),
                volume: parseFloat(volume.toFixed(4))
            };
        });

        this.rawPrices.set([...this.assets]);
    }

    private getVolatilityFactor(id: string): number {
        const volatilityMap: { [key: string]: number } = {
            'bitcoin': 1.5,
            'ethereum': 2.0,
            'bnb': 1.8,
            'solana': 3.5,
            'ripple': 2.5,
            'cardano': 2.2
        };
        return volatilityMap[id] || 2.0;
    }

    private getBasePrice(id: string): number {
        const basePrices: { [key: string]: number } = {
            'bitcoin': 44500,
            'ethereum': 2750,
            'bnb': 315,
            'solana': 95,
            'ripple': 0.50,
            'cardano': 0.44
        };
        return basePrices[id] || 100;
    }

    ngOnDestroy(): void {
        this.subscription?.unsubscribe();
    }
}
