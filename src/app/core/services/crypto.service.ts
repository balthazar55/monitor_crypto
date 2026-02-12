import { Injectable, signal, WritableSignal, OnDestroy, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CryptoAsset } from '../models/crypto-asset.model';
import { map, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CryptoService implements OnDestroy {
    private http = inject(HttpClient);

    rawPrices: WritableSignal<CryptoAsset[]> = signal([]);

    private wsSubscription: WebSocket | null = null;
    private reconnectInterval: any;
    private readonly HISTORY_LENGTH = 20;

    // Solo 6 activos (eliminados tron y dogecoin)
    private assetsMap = new Map<string, CryptoAsset>([
        ['bitcoin', {
            id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', price: 0, change24h: 0,
            ma50: 0, volume: 0, priceHistory: [], icon: 'bitcoin'
        }],
        ['ethereum', {
            id: 'ethereum', name: 'Ethereum', symbol: 'ETH', price: 0, change24h: 0,
            ma50: 0, volume: 0, priceHistory: [], icon: 'ethereum'
        }],
        ['bnb', {
            id: 'bnb', name: 'BNB', symbol: 'BNB', price: 0, change24h: 0,
            ma50: 0, volume: 0, priceHistory: [], icon: 'bnb'
        }],
        ['solana', {
            id: 'solana', name: 'Solana', symbol: 'SOL', price: 0, change24h: 0,
            ma50: 0, volume: 0, priceHistory: [], icon: 'solana'
        }],
        ['ripple', {
            id: 'ripple', name: 'Ripple', symbol: 'XRP', price: 0, change24h: 0,
            ma50: 0, volume: 0, priceHistory: [], icon: 'ripple'
        }],
        ['cardano', {
            id: 'cardano', name: 'Cardano', symbol: 'ADA', price: 0, change24h: 0,
            ma50: 0, volume: 0, priceHistory: [], icon: 'cardano'
        }]
    ]);

    private streamToIdMap: { [key: string]: string } = {
        'btcusdt@ticker': 'bitcoin',
        'ethusdt@ticker': 'ethereum',
        'bnbusdt@ticker': 'bnb',
        'solusdt@ticker': 'solana',
        'xrpusdt@ticker': 'ripple',
        'adausdt@ticker': 'cardano'
    };

    private idToSymbolMap: { [key: string]: string } = {
        'bitcoin': 'BTCUSDT',
        'ethereum': 'ETHUSDT',
        'bnb': 'BNBUSDT',
        'solana': 'SOLUSDT',
        'ripple': 'XRPUSDT',
        'cardano': 'ADAUSDT'
    };

    constructor() {
        this.connect();
    }

    getOHLC(coinId: string, interval: string = '1h', limit: number = 24): Observable<any[]> {
        const symbol = this.idToSymbolMap[coinId];
        if (!symbol) {
            throw new Error('Symbol not found');
        }

        const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;

        return this.http.get<any[]>(url).pipe(
            map(data => data.map(d => ({
                x: new Date(d[0]),
                y: [parseFloat(d[1]), parseFloat(d[2]), parseFloat(d[3]), parseFloat(d[4])]
            })))
        );
    }

    private connect() {
        if (this.wsSubscription) return;

        const streams = Object.keys(this.streamToIdMap).join('/');
        console.log('Connecting to Binance Streams:', streams);
        this.wsSubscription = new WebSocket(`wss://stream.binance.com:9443/stream?streams=${streams}`);

        this.wsSubscription.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.stream && message.data) {
                this.updateAsset(message.stream, message.data);
            }
        };

        this.wsSubscription.onclose = () => {
            console.warn('WebSocket disconnected. Reconnecting...');
            this.wsSubscription = null;
            this.reconnectInterval = setTimeout(() => this.connect(), 3000);
        };

        this.wsSubscription.onerror = (err) => {
            console.error('WebSocket Error:', err);
            this.wsSubscription?.close();
        };
    }

    private updateAsset(stream: string, data: any) {
        const assetId = this.streamToIdMap[stream];
        if (!assetId) return;

        const currentAsset = this.assetsMap.get(assetId);
        if (currentAsset) {
            const newPrice = parseFloat(data.c);
            const currentHistory = currentAsset.priceHistory || [];

            // Actualizar historial para sparkline
            const newHistory = currentHistory.length >= this.HISTORY_LENGTH
                ? [...currentHistory.slice(1), newPrice]
                : [...currentHistory, newPrice];

            // Calcular MA50 (promedio del historial)
            const ma50 = newHistory.length > 0
                ? newHistory.reduce((a, b) => a + b, 0) / newHistory.length
                : newPrice;

            // Binance ticker: v = Total traded base asset volume
            const volume = parseFloat(data.v) || 0;

            this.assetsMap.set(assetId, {
                ...currentAsset,
                price: newPrice,
                change24h: parseFloat(data.P),
                priceHistory: newHistory,
                ma50: parseFloat(ma50.toFixed(2)),
                volume: parseFloat((volume / 1000).toFixed(4)) // En miles
            });

            this.emitUpdates();
        }
    }

    private emitUpdates() {
        this.rawPrices.set(Array.from(this.assetsMap.values()));
    }

    ngOnDestroy() {
        if (this.wsSubscription) {
            this.wsSubscription.close();
        }
        clearTimeout(this.reconnectInterval);
    }
}
