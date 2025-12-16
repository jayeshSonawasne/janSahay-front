import { Component } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from 'src/app/shared/components/breadcrumb/breadcrumb.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, BreadcrumbComponent, TranslateModule, MatIconModule, MatButtonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  language!: string;

  constructor(private translate: TranslateService, private webStorage: WebStorageService) {
    this.selectLanguage()
  }

  selectLanguage(lang?: any) {
    this.language = lang ? lang : 'English';
    this.webStorage.selLanguage.next(this.language);
    this.translate.use(this.language);
  }

}
