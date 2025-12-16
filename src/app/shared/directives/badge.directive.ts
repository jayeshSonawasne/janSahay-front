import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[appBadge]'
})
export class BadgeDirective {
  element!: ElementRef;

  @Input() appBadge: any;

  constructor(el: ElementRef) {
    this.element = el;
  }

  ngOnInit() {
    let id = this.appBadge; // ['1','2','3','4'] Status/Action ID 
    let str = id == 1 ? 'bg-success' : id == 2 ? 'bg-danger' : id == 3 ? 'bg-info' : 'bg-warning';
    this.element.nativeElement.classList.add(str);
  }
}
