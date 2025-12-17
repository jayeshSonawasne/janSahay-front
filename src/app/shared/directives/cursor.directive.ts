import { Directive, HostListener, AfterViewInit, OnDestroy, Inject, PLATFORM_ID, NgZone, Renderer2 } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
    selector: '[appSmoothCursor]',
    standalone: true
})
export class CursorDirective implements AfterViewInit, OnDestroy {
    private cursorDot: HTMLElement | null = null;
    private cursorOutline: HTMLElement | null = null;

    private mouseX = 0;
    private mouseY = 0;
    private outlineX = 0;
    private outlineY = 0;

    private requestAnimationId: number | null = null;
    private isHovering = false;
    private isVisible = false;

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        private ngZone: NgZone,
        private renderer: Renderer2
    ) { }

    ngAfterViewInit(): void {
        if (isPlatformBrowser(this.platformId)) {
            // Only enable on desktop/large screens
            if (window.matchMedia('(min-width: 992px)').matches) {
                this.initCursor();
            }
        }
    }

    ngOnDestroy(): void {
        if (this.cursorDot) {
            this.cursorDot.remove();
        }
        if (this.cursorOutline) {
            this.cursorOutline.remove();
        }
        if (this.requestAnimationId) {
            cancelAnimationFrame(this.requestAnimationId);
        }
    }

    private initCursor(): void {
        // Create elements
        this.cursorDot = this.renderer.createElement('div');
        this.cursorOutline = this.renderer.createElement('div');

        this.renderer.addClass(this.cursorDot, 'cursor-dot');
        this.renderer.addClass(this.cursorOutline, 'cursor-outline');

        this.renderer.appendChild(document.body, this.cursorDot);
        this.renderer.appendChild(document.body, this.cursorOutline);

        // Initial position
        this.mouseX = window.innerWidth / 2;
        this.mouseY = window.innerHeight / 2;
        this.outlineX = this.mouseX;
        this.outlineY = this.mouseY;

        // Start animation loop outside Angular zone to avoid change detection cycles
        this.ngZone.runOutsideAngular(() => {
            this.animate();
        });
    }

    @HostListener('window:mousemove', ['$event'])
    onMouseMove(e: MouseEvent): void {
        if (!this.isVisible) {
            this.isVisible = true;
            if (this.cursorDot) this.cursorDot.style.opacity = '1';
            if (this.cursorOutline) this.cursorOutline.style.opacity = '1';
        }
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;

        // Immediate update for dot
        if (this.cursorDot) {
            this.cursorDot.style.left = `${this.mouseX}px`;
            this.cursorDot.style.top = `${this.mouseY}px`;
        }
    }

    @HostListener('document:mouseover', ['$event'])
    onMouseOver(e: MouseEvent): void {
        const target = e.target as HTMLElement;
        // Check if hovering over interactive elements
        if (
            target.tagName === 'A' ||
            target.tagName === 'BUTTON' ||
            target.closest('a') ||
            target.closest('button') ||
            target.classList.contains('card') ||
            target.classList.contains('cursor-hover') ||
            getComputedStyle(target).cursor === 'pointer'
        ) {
            this.isHovering = true;
        } else {
            this.isHovering = false;
        }
    }

    @HostListener('window:mouseout')
    onMouseOut(): void {
        this.isVisible = false;
        if (this.cursorDot) this.cursorDot.style.opacity = '0';
        if (this.cursorOutline) this.cursorOutline.style.opacity = '0';
    }

    private animate(): void {
        // Inertia for outline
        // Lower factor = more delay/smoother (e.g. 0.15)
        const inertia = 0.15;

        this.outlineX += (this.mouseX - this.outlineX) * inertia;
        this.outlineY += (this.mouseY - this.outlineY) * inertia;

        if (this.cursorOutline) {
            this.cursorOutline.style.left = `${this.outlineX}px`;
            this.cursorOutline.style.top = `${this.outlineY}px`;

            // Scale effect on hover
            if (this.isHovering) {
                this.cursorOutline.style.transform = `translate(-50%, -50%) scale(1.5)`;
                this.cursorOutline.style.backgroundColor = 'rgba(79, 124, 255, 0.1)';
            } else {
                this.cursorOutline.style.transform = `translate(-50%, -50%) scale(1)`;
                this.cursorOutline.style.backgroundColor = 'transparent';
            }
        }

        this.requestAnimationId = requestAnimationFrame(() => this.animate());
    }
}
