import { Component, Input, OnChanges, inject, signal, ViewChild, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule, ChartComponent, ApexAxisChartSeries, ApexChart, ApexYAxis, ApexXAxis, ApexTitleSubtitle } from "ng-apexcharts";
import { CryptoService } from '../../../../core/services/crypto.service';

export type ChartOptions = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    xaxis: ApexXAxis;
    yaxis: ApexYAxis;
    title: ApexTitleSubtitle;
};

@Component({
    selector: 'app-candlestick-chart', // Reverted selector
    standalone: true,
    imports: [CommonModule, NgApexchartsModule],
    templateUrl: './candlestick-chart.html',
    styles: [`
    :host {
      display: block;
      background: rgba(255, 255, 255, 0.05); /* Glass effect base */
      border-radius: 16px;
      padding: 1rem;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .chart-controls {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 1rem;
    }

    button {
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: #ddd;
        padding: 4px 12px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.85rem;
        transition: all 0.2s;
    }

    button:hover {
        background: rgba(255, 255, 255, 0.2);
        color: #fff;
    }

    button.active {
        background: #f0b90b; /* Binance Gold */
        color: #000;
        font-weight: bold;
        border-color: #f0b90b;
    }
  `]
})
export class CandlestickChartComponent implements OnChanges {
    @Input({ required: true }) coinId!: string;
    @ViewChild("chart") chart: ChartComponent | undefined;

    private cryptoService = inject(CryptoService);

    // Timeframe state
    activeTimeframe = signal<'1h' | '1d' | '1w'>('1h');

    chartOptions: Partial<ChartOptions> | any = {
        series: [],
        chart: {
            type: "candlestick",
            height: 350,
            background: 'transparent',
            toolbar: {
                show: true,
                tools: {
                    download: false, // Hide download button if not needed
                    selection: true,
                    zoom: true,
                    zoomin: true,
                    zoomout: true,
                    pan: true,
                    reset: true
                }
            },
            animations: {
                enabled: false // Disable animation for smoother updates
            }
        },
        title: {
            text: "Historial de Precios (24h)",
            align: "left",
            style: {
                color: '#fff'
            }
        },
        xaxis: {
            type: "datetime",
            labels: {
                style: {
                    colors: '#888'
                }
            }
        },
        yaxis: {
            tooltip: {
                enabled: true
            },
            labels: {
                style: {
                    colors: '#888'
                },
                formatter: (value: number) => {
                    return "$" + value.toFixed(2);
                }
            }
        },
        theme: {
            mode: 'dark'
        }
    };

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['coinId'] && this.coinId) {
            this.loadData();
        }
    }

    setTimeframe(timeframe: '1h' | '1d' | '1w') {
        this.activeTimeframe.set(timeframe);
        this.loadData();
    }

    loadData() {
        const tf = this.activeTimeframe();
        let interval = '1h';
        let limit = 24;
        let titleSuffix = "(24h)";

        switch (tf) {
            case '1h':
                interval = '1h';
                limit = 500; // Increased to allow zooming back (approx 20 days)
                titleSuffix = "(1H Interval)";
                break;
            case '1d':
                interval = '1d';
                limit = 365; // 1 Year of daily data
                titleSuffix = "(Diario)";
                break;
            case '1w':
                interval = '1w';
                limit = 156; // 3 Years of weekly data
                titleSuffix = "(Semanal)";
                break;
        }

        this.cryptoService.getOHLC(this.coinId, interval, limit).subscribe({
            next: (data) => {
                this.chartOptions.series = [{
                    name: "candle",
                    data: data
                }];

                // Update title
                this.chartOptions.title = {
                    ...this.chartOptions.title,
                    text: `Gráfico de ${this.coinId.toUpperCase()} ${titleSuffix}`
                };
            },
            error: (err) => console.error("Failed to load chart data", err)
        });
    }
}
