import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BadgeDirective } from './badge.directive';
import { HighlightDirective } from './highlight.directive';
import { AllowEnglishOnlyDirective } from './allow-english-only.directive';

@NgModule({
  declarations: [BadgeDirective, HighlightDirective,  AllowEnglishOnlyDirective],
  imports: [
    CommonModule
  ],
  exports: [BadgeDirective, HighlightDirective,AllowEnglishOnlyDirective]
})
export class DirectivesModule { }
