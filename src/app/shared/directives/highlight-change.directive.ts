import { Directive, ElementRef, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';

@Directive({
    selector: '[appHighlightChange]',
    standalone: true
})
export class HighlightChangeDirective implements OnChanges {
    @Input('appHighlightChange') value: number = 0;

    constructor(private el: ElementRef, private renderer: Renderer2) { }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['value'] && !changes['value'].isFirstChange()) {
            const prev = changes['value'].previousValue;
            const curr = changes['value'].currentValue;

            // Clean classes first
            this.renderer.removeClass(this.el.nativeElement, 'flash-green');
            this.renderer.removeClass(this.el.nativeElement, 'flash-red');

            // Force reflow to restart animation if triggered rapidly
            void this.el.nativeElement.offsetWidth;

            if (curr > prev) {
                this.flashColor('green');
            } else if (curr < prev) {
                this.flashColor('red');
            }
        }
    }

    private flashColor(color: 'green' | 'red') {
        const className = color === 'green' ? 'flash-green' : 'flash-red';
        this.renderer.addClass(this.el.nativeElement, className);

        // Remove class after animation completes (1s)
        setTimeout(() => {
            this.renderer.removeClass(this.el.nativeElement, className);
        }, 1000);
    }
}
