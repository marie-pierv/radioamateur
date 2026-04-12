import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';

// On définit les types de variants possibles
export type TitleVariant = 'h1' | 'h2' | 'h3' | 'p' | 'p-large';

@Component({
  selector: 'app-title',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="variantClass()">
      <ng-content></ng-content>
    </div>
  `,
  styleUrl: './title.scss',
})
export class Title {
  variant = input<TitleVariant>('p');

  variantClass = computed(() => `title-${this.variant()}`);
}
