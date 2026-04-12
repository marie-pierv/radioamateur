import { Component, input } from '@angular/core';
import { Title } from '../title/title';

@Component({
  selector: 'app-label',
  imports: [Title],
  templateUrl: './label.html',
  styleUrl: './label.scss',
})
export class Label {
  for = input<string>('');
}
