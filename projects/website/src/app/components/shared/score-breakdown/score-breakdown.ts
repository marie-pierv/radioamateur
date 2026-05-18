import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PracticeExam } from '../../../services/practice-exam';
import { Title } from '../title/title';
import { CategoryDefinition } from '../../../interfaces/interface-category';
import { CategoryStat } from '../../../interfaces/interface-category-stats';

@Component({
  selector: 'app-score-breakdown',
  imports: [Title, CommonModule],
  templateUrl: './score-breakdown.html',
  styleUrl: './score-breakdown.scss',
})
export class ScoreBreakdown implements OnInit {
  private practiceExam = inject(PracticeExam);

  readonly categories: CategoryDefinition[] = [
    { code: 'B-001', name: 'Règlements et politiques' },
    { code: 'B-002', name: 'Procédures d’exploitation' },
    { code: 'B-003', name: 'Modes de transmission' },
    { code: 'B-004', name: 'Circuits et composants' },
    { code: 'B-005', name: 'Signaux et mesures' },
    { code: 'B-006', name: 'Antennes et lignes' },
    { code: 'B-007', name: 'Propagation' },
    { code: 'B-008', name: 'Brouillage et sécurité' },
  ];

  private isInitialized = signal(false);

  ngOnInit(): void {
    this.isInitialized.set(true);
  }

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

  globalStatsByCategory = computed<CategoryStat[]>(() => {
    if (!this.isInitialized()) return [];
    const history = this.practiceExam.globalHistory() as any;

    if (!history || !history.examens || history.examens.length === 0) {
      return [];
    }

    const allPastAnswers = history.examens.flatMap((examen: any) => examen.answers || []);

    return this.categories.map((cat) => {
      const questionsInCategory = allPastAnswers.filter((ans: any) => {
        const questionId = ans.question || '';
        return questionId.startsWith(cat.code);
      });

      const total = questionsInCategory.length;
      const correct = questionsInCategory.filter(
        (ans: any) => ans.answer === ans.correctAnswer,
      ).length;

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
