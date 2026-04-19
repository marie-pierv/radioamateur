import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-exam-progress',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="progress-wrapper">
      <div class="progress-info">
        <span>Progression</span>
        <span class="count">Question {{ current() + 1 }} sur {{ total() }}</span>
      </div>

      <div class="progress-track">
        <div class="progress-bar" [style.width.%]="percentage()"></div>
      </div>

      <div class="percentage-label">{{ percentage() | number: '1.0-0' }}% complété</div>
    </div>
  `,
  styleUrl: './exam-progress.scss',
})
export class ExamProgress {
  // Inputs sous forme de Signals
  current = input.required<number>(); // L'index actuel (ex: 0, 1, 2...)
  total = input.required<number>(); // Le total choisi (ex: 10, 20...)

  // Calcul automatique du pourcentage
  percentage = computed(() => {
    if (this.total() <= 0) return 0;
    // On fait +1 car l'index commence à 0, mais on veut montrer l'avancement de la question en cours
    const progress = (this.current() / this.total()) * 100;
    return Math.min(progress, 100); // On ne dépasse jamais 100%
  });
}
