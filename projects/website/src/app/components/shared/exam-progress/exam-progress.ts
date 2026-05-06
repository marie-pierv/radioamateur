import { Component, inject, computed, input } from '@angular/core';
import { PracticeExam } from '../../../services/practice-exam';
import { CommonModule } from '@angular/common';
import { Button } from '../button/button';
import { Title } from '../title/title';

@Component({
  selector: 'app-exam-progress',
  standalone: true,
  imports: [CommonModule, Button, Title],
  template: `<p>exam-progress works!</p>`,
  templateUrl: './exam-progress.html',
  styleUrl: './exam-progress.scss',
})
export class ExamProgress {
  protected practice = inject(PracticeExam);

  current = input.required<number>();
  total = input.required<number>();

  //Signaux basés sur le service PracticeExam
  questionsAnswered = this.practice.countAnswered;
  totalQuestions = this.practice.totalQuestions;
  correctAnswersCount = this.practice.correctAnswersCount;
  progressPercentage = this.practice.progressPercent;
  successRate = computed(() => Math.round(this.practice.successRate()));

  // Calcul de fin : égalité des 2
  isFinished = computed(() => {
    const current = this.questionsAnswered();
    const total = this.totalQuestions();
    return current > 0 && current === total;
  });

  finalScore = computed(() => Math.round(this.practice.successRate()));

  feedbackMessage = computed(() => {
    const score = this.finalScore();

    if (score >= 80) {
      return 'Expert Radio : Fréquence maîtrisée.';
    } else if (score >= 60) {
      return "Contact établi : Très peu d'interférences.";
    } else {
      return 'Signal faible : Continuez de pratiquer pour améliorer la réception.';
    }
  });
}
