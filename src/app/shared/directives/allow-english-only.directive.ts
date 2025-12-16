import { Directive, HostListener, ElementRef } from '@angular/core';
import { CommonMethodService } from 'src/app/core/services/common-method.service';

@Directive({
  selector: '[appAllowEnglishOnly]'
})
export class AllowEnglishOnlyDirective {


  constructor(private el: ElementRef, private commonMethodService:CommonMethodService) { }

  @HostListener('input', ['$event'])
  onInput(_event: KeyboardEvent) {
    this.validateValue();
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    let windows: any = window;
    const clipboardData = event.clipboardData || windows['clipboardData'];
    const pastedText = clipboardData.getData('text');

    if (!this.isEnglish(pastedText)) {
      event.preventDefault();
      this.commonMethodService.snackBar('Only English text is allowed.', 1);
    }
  }

  private validateValue() {
    const inputValue = this.el.nativeElement.value;

    if (!this.isEnglish(inputValue)) {
      this.el.nativeElement.value = inputValue.replace(/[^a-zA-Z\s]/g, '');
    }
  }

  private isEnglish(text: string): boolean {
    const englishRegex = /^[a-zA-Z\s]*$/;
    return englishRegex.test(text);
  }

}