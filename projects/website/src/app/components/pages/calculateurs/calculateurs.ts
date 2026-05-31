import { Component } from '@angular/core';
import { Title } from '../../shared/title/title';
import { Button } from '../../shared/button/button';

@Component({
  selector: 'app-calculateurs',
  imports: [Title, Button],
  templateUrl: './calculateurs.html',
  styleUrl: './calculateurs.scss',
})
export class Calculateurs {}
