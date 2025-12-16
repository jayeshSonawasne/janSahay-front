import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebStorageService } from 'src/app/core/services/web-storage.service';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent {
  breadcrumbs: any = [];

  constructor(private webStorageService: WebStorageService) { }

  ngOnInit(): void {
    this.webStorageService.breadCrumbObs.subscribe((res) => {
      this.breadcrumbs = res;
    })
  }
}
