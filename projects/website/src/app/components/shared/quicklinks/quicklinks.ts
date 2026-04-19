import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { InterfaceQuickLinks } from '../../../interfaces/interface-quicklinks';

@Component({
  selector: 'app-quicklinks',
  imports: [RouterLink],
  templateUrl: './quicklinks.html',
  styleUrl: './quicklinks.scss',
})
export class Quicklinks {
  links = input<InterfaceQuickLinks[]>([]);
}
