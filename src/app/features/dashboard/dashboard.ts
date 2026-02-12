import { Component, computed, effect, inject, signal, ChangeDetectionStrategy, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CryptoService } from '../../core/services/crypto.service';
import { CryptoCard } from './components/crypto-card/crypto-card';
import { CryptoAsset } from '../../core/models/crypto-asset.model';
import { CandlestickChartComponent } from './components/candlestick-chart/candlestick-chart.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, CryptoCard, CandlestickChartComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Dashboard implements OnDestroy {
  private cryptoService = inject(CryptoService);

  // Signals
  rawPrices = this.cryptoService.rawPrices;
  threshold = signal(5000); // Example threshold
  selectedAsset = signal<CryptoAsset | null>(null);

  // Logic for filtered view: Assets with change > 0.5% (simulated "significant" change)
  filteredAssets = computed(() => {
    return this.rawPrices()
      .filter(a => Math.abs(a.change24h) > 0.5)
      .sort((a, b) => b.price - a.price); // Sort by Price Descending
  });

  // Worker Data
  marketStats = signal<{ avg: number, maxVol: number, vol: number } | null>(null);

  private worker: Worker | undefined;

  constructor() {
    this.initWorker();

    // Sync data to worker
    effect((onCleanup) => {
      const data = this.rawPrices();
      this.worker?.postMessage(data);
    });
  }

  ngOnDestroy() {
    this.worker?.terminate();
  }

  private initWorker() {
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

  updateThreshold(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.threshold.set(Number(val));
  }

  selectAsset(asset: CryptoAsset) {
    this.selectedAsset.set(asset);
  }
}
