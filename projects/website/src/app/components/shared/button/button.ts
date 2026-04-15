import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './button.html',
  styleUrl: './button.scss',
})
export class Button {
  disabled = input<boolean>(false);
  // Les propriétés de configuration (Inputs)
  readonly variant = input<'primary' | 'secondary' | 'success' | 'tile' | 'answer'>('primary'); // Si on passe un lien, il devient un lien de navigation
  link = input<string | null>(null);

  isSelected = input<boolean>(false);
  // Pour savoir s'il doit soumettre un formulaire
  type = input<'button' | 'submit'>('button');

  // Pour déclencher une action (ex: lancer le scan)
  btnClick = output<void>();

  onClick() {
    this.btnClick.emit();
  }
}
