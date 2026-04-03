import { Component } from '@angular/core';
import { Button } from '../button/button';
import { TextH1 } from '../text-h1/text-h1';
import { TextPlarge } from '../text-p-large/text-p-large';

@Component({
  selector: 'app-hero',
  imports: [Button, TextH1, TextPlarge],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class Hero {}
