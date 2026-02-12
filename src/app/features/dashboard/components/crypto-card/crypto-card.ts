import { Component, computed, input, ChangeDetectionStrategy, ElementRef, ViewChild, AfterViewInit, effect, signal } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CryptoAsset } from '../../../../core/models/crypto-asset.model';
import { HighlightChangeDirective } from '../../../../shared/directives/highlight-change.directive';

@Component({
  selector: 'app-crypto-card',
  standalone: true,
  imports: [CommonModule, HighlightChangeDirective, DecimalPipe, FormsModule],
  templateUrl: './crypto-card.html',
  styleUrl: './crypto-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CryptoCard implements AfterViewInit {
  @ViewChild('sparklineCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  readonly asset = input.required<CryptoAsset>();

  // Umbral individual por tarjeta
  readonly threshold = signal(0);

  readonly isAboveThreshold = computed(() => {
    return this.threshold() > 0 && this.asset().price > this.threshold();
  });

  readonly isPositiveChange = computed(() => {
    return this.asset().change24h >= 0;
  });

  readonly iconUrl = computed(() => {
    const icons: { [key: string]: string } = {
      'bitcoin': '₿',
      'ethereum': 'Ξ',
      'solana': '◎',
      'cardano': '₳',
      'bnb': '🔶',
      'ripple': '✕'
    };
    return icons[this.asset().id] || '●';
  });

  readonly iconBgColor = computed(() => {
    const colors: { [key: string]: string } = {
      'bitcoin': '#f7931a',
      'ethereum': '#627eea',
      'solana': '#00FFA3',
      'cardano': '#0033AD',
      'bnb': '#F3BA2F',
      'ripple': '#23292F'
    };
    return colors[this.asset().id] || '#666';
  });

  constructor() {
    effect(() => {
      const asset = this.asset();
      if (asset.priceHistory && this.canvasRef) {
        this.drawSparkline(asset.priceHistory, asset.change24h >= 0);
      }
    });
  }

  ngAfterViewInit() {
    const asset = this.asset();
    if (asset.priceHistory) {
      setTimeout(() => this.drawSparkline(asset.priceHistory!, asset.change24h >= 0), 0);
    }
  }

  updateThreshold(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.threshold.set(Number(val));
  }

  private drawSparkline(data: number[], isPositive: boolean) {
    if (!this.canvasRef || data.length < 2) return;

    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const padding = 2;

    ctx.clearRect(0, 0, width, height);

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    const points: [number, number][] = data.map((val, i) => [
      padding + (i / (data.length - 1)) * (width - padding * 2),
      height - padding - ((val - min) / range) * (height - padding * 2)
    ]);

    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i][0], points[i][1]);
    }
    ctx.strokeStyle = isPositive ? '#4ade80' : '#f87171';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.lineTo(points[points.length - 1][0], height);
    ctx.lineTo(points[0][0], height);
    ctx.closePath();

    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    if (isPositive) {
      gradient.addColorStop(0, 'rgba(74, 222, 128, 0.3)');
      gradient.addColorStop(1, 'rgba(74, 222, 128, 0)');
    } else {
      gradient.addColorStop(0, 'rgba(248, 113, 113, 0.3)');
      gradient.addColorStop(1, 'rgba(248, 113, 113, 0)');
    }
    ctx.fillStyle = gradient;
    ctx.fill();
  }
}
