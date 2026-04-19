import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button } from '../button/button';
import { Card } from '../card/card';

@Component({
  selector: 'app-quicklinks',
  imports: [RouterLink, Button, Card],
  templateUrl: './quicklinks.html',
  styleUrl: './quicklinks.scss',
})
export class Quicklinks {}
