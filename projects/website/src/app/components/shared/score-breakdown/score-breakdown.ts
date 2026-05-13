import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PracticeExam } from '../../../services/practice-exam';
import { Button } from '../button/button';
import { Title } from '../title/title';
import { CategoryDefinition } from '../../../interfaces/interface-category';
import { CategoryStat } from '../../../interfaces/interface-category-stats';

@Component({
  selector: 'app-score-breakdown',
  imports: [Button, Title, CommonModule],
  templateUrl: './score-breakdown.html',
  styleUrl: './score-breakdown.scss',
})
export class ScoreBreakdown {
  private practiceExam = inject(PracticeExam);

  readonly categories: CategoryDefinition[] = [
    { code: 'B-001', name: 'Règlements' },
    { code: 'B-002', name: 'Procédures' },
    { code: 'B-003', name: 'Modes de transmission' },
    { code: 'B-004', name: 'Circuits' },
    { code: 'B-005', name: 'Signaux' },
    { code: 'B-006', name: 'Antennes' },
    { code: 'B-007', name: 'Propagation' },
    { code: 'B-008', name: 'Sécurité' },
  ];

  // Stats de l'examen en cours
  statsByCategory = computed<CategoryStat[]>(() => {
    const answersMap = this.practiceExam.answers();

    return this.categories.map((cat) => {
      const questionsInCategory = Array.from(answersMap.entries()).filter(([id]) =>
        id.startsWith(cat.code),
      );

      const total = questionsInCategory.length;
      const correct = questionsInCategory.filter(([_, details]) => details.isCorrect).length;

      return {
        code: cat.code,
        name: cat.name,
        total,
        correct,
        percent: total > 0 ? Math.round((correct / total) * 100) : 0,
      };
    });
  });

  // Stats historiques (LocalStorage global)
  globalStatsByCategory = computed<CategoryStat[]>(() => {
    // On utilise le signal du service ici
    const history = this.practiceExam.globalHistory();
    const historyEntries = Object.entries(history);

    return this.categories.map((cat) => {
      const questionsInCategory = historyEntries.filter(([id]) => id.startsWith(cat.code));

      const total = questionsInCategory.length;
      const correct = questionsInCategory.filter(([_, isCorrect]) => isCorrect === true).length;

      return {
        code: cat.code,
        name: cat.name,
        total,
        correct,
        percent: total > 0 ? Math.round((correct / total) * 100) : 0,
      };
    });
  });
}
