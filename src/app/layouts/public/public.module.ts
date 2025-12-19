import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicRoutingModule } from './public-routing.module';
import { PublicComponent } from './public.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { TeamComponent } from './team/team.component';


@NgModule({
  declarations: [
    PublicComponent,
  ],
  imports: [
    TeamComponent,
    CommonModule,
    PublicRoutingModule,
    HeaderComponent,
    FooterComponent
  ]
})
export class PublicModule { }
