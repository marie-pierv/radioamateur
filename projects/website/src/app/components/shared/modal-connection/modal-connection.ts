import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '../title/title';

@Component({
  selector: 'app-modal-connection',
  standalone: true,
  imports: [CommonModule, Title],
  templateUrl: './modal-connection.html',
  styleUrl: './modal-connection.scss',
})
export class ModalConnection {
  // Va chercher la référence de la balise <dialog> du HTML
  @ViewChild('loginDialog') dialog!: ElementRef<HTMLDialogElement>;

  // Méthode que le parent pourra appeler
  open(): void {
    this.dialog.nativeElement.showModal();
    // .showModal() ouvre la fenêtre et crée le background
  }

  close(): void {
    this.dialog.nativeElement.close();
  }

  onSubmit(): void {
    console.log('Tentative de connexion...');
    // Logique d'authentification à ajouter ici
    this.close();
  }
}
