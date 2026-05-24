import { Component } from '@angular/core';
import { Button } from '../button/button';
import { RouterLink } from '@angular/router';
import { ModalConnection } from '../modal-connection/modal-connection';

@Component({
  selector: 'app-navbar',
  imports: [Button, RouterLink, ModalConnection],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
