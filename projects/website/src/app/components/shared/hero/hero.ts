import { Component } from '@angular/core';
import { Button } from '../button/button';
import { Title } from '../title/title';

@Component({
  selector: 'app-hero',
  imports: [Button, Title],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class Hero {}
