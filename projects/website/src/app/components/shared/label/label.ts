import { Component, input } from '@angular/core';
import { TextP } from '../text-p/text-p';

@Component({
  selector: 'app-label',
  imports: [TextP],
  templateUrl: './label.html',
  styleUrl: './label.scss',
})
export class Label {
  for = input<string>('');
}
