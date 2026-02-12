export interface CryptoAsset {
    id: string;
    name: string;
    symbol: string;
    price: number;
    change24h: number; // percentage change
    ma50?: number; // Moving Average 50
    volume?: number; // Trading volume
    priceHistory?: number[]; // For sparkline chart
    icon?: string; // Icon identifier
}
