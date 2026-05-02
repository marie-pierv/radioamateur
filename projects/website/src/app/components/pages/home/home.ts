import { Component } from '@angular/core';
import { Button } from '../../shared/button/button';
import { Loader } from '../../shared/loader/loader';
import { Hero } from '../../shared/hero/hero';
import { HpBlocText } from '../../shared/hp-bloc-text/hp-bloc-text';
import { Hp2Col } from '../../shared/hp-2-col/hp-2-col';
import { HpWhy } from '../../shared/hp-why/hp-why';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Button, Loader, Hero, HpBlocText, Hp2Col, HpWhy],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {}
