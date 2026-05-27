import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { InterfaceQuickLinks } from '../../../interfaces/interface-quicklinks';
import { Title } from '../title/title';

@Component({
  selector: 'app-quicklinks',
  imports: [RouterLink, Title],
  templateUrl: './quicklinks.html',
  styleUrl: './quicklinks.scss',
})
export class Quicklinks {
  links = input<InterfaceQuickLinks[]>([]);
}
