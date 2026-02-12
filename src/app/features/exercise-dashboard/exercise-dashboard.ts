import { Component, computed, effect, inject, signal, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SimulatedCryptoService, SimulatedCryptoAsset } from '../../core/services/simulated-crypto.service';
import { ExerciseCryptoCard } from './components/exercise-crypto-card/exercise-crypto-card';

@Component({
    selector: 'app-exercise-dashboard',
    standalone: true,
    imports: [CommonModule, ExerciseCryptoCard, RouterLink],
    templateUrl: './exercise-dashboard.html',
    styleUrl: './exercise-dashboard.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExerciseDashboard implements OnDestroy {
    private cryptoService = inject(SimulatedCryptoService);

    readonly rawPrices = this.cryptoService.rawPrices;
    readonly threshold = signal(1000);

    // topGainers: Filtrado por changePercent > 5%
    readonly topGainers = computed(() => {
        return this.rawPrices()
            .filter(p => p.changePercent > 5)
            .sort((a, b) => b.changePercent - a.changePercent);
    });

    readonly averagePrice = computed(() => {
        const prices = this.rawPrices();
        if (prices.length === 0) return 0;
        return prices.reduce((acc, curr) => acc + curr.price, 0) / prices.length;
    });

    readonly marketStats = signal<{ avg: number; maxVol: number; vol: number } | null>(null);
    private worker: Worker | undefined;

    constructor() {
        this.initWorker();

        effect((onCleanup) => {
            const data = this.rawPrices();
            if (data.length > 0) {
                this.worker?.postMessage(data);
            }
        });
    }

    ngOnDestroy(): void {
        this.worker?.terminate();
    }

    private initWorker(): void {
        if (typeof Worker !== 'undefined') {
            this.worker = new Worker(new URL('../../workers/calculation.worker', import.meta.url));
            this.worker.onmessage = ({ data }) => {
                this.marketStats.set({
                    avg: data.averagePrice,
                    maxVol: data.maxChange,
                    vol: data.marketVolatility
                });
            };
        }
    }

    updateThreshold(event: Event): void {
        const val = (event.target as HTMLInputElement).value;
        this.threshold.set(Number(val));
    }
}
