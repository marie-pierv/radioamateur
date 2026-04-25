import { Component, inject, computed } from '@angular/core';
import { PracticeExam } from '../../../services/practice-exam';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-exam-progress',
  imports: [CommonModule],
  template: `<p>exam-progress works!</p>`,
  templateUrl: './exam-progress.html',
  styleUrl: './exam-progress.css',
})
export class ExamProgress {
  private practice = inject(PracticeExam);

  //Signaux basés sur le service PracticeExam
  questionsAnswered = this.practice.countAnswered;
  totalQuestions = this.practice.totalQuestions;
  correctAnswersCount = this.practice.correctAnswersCount;
  progressPercentage = this.practice.progressPercent;
  successRate = computed(() => Math.round(this.practice.successRate()));
}
