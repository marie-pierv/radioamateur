import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from '../../shared/navbar/navbar';
import { Footer } from '../../shared/footer/footer';

@Component({
  selector: 'app-default',
  imports: [RouterOutlet, Navbar, Footer],
  templateUrl: './default.html',
  styleUrl: './default.scss',
})
export class Default {}
