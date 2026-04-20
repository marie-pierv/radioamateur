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
  current = input<number>(0);
  total = input<number>(0);

  // Calcul de pourcentage
  percentage = computed(() => {
    const t = this.total();
    const c = this.current();

    if (t <= 0) return 0;

    const progress = (c / t) * 100;
    return Math.min(progress, 100);
  });
}
