import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-public-home',
    standalone: true,
    imports: [CommonModule],
    template: `<div class="container mt-5"><h2>Public Home</h2><p>Welcome to the public home page.</p></div>`
})
export class HomeComponent { }
