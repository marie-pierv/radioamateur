import { Component, inject, signal } from '@angular/core';
import { Card } from '../../shared/card/card';
import { ExamDisplay } from '../../shared/exam-display/exam-display';
import { FormStartExam } from '../../shared/form-start-exam/form-start-exam';
import { ExamProgress } from '../../shared/exam-progress/exam-progress';
import { RouterOutlet } from '@angular/router';
import { PracticeExam } from '../../../services/practice-exam';
import { ScoreBreakdown } from '../../shared/score-breakdown/score-breakdown';
import { Button } from '../../shared/button/button';

@Component({
  selector: 'app-exam-generator',
  standalone: true,
  imports: [RouterOutlet, FormStartExam, Card, ExamDisplay, ExamProgress, ScoreBreakdown, Button],
  templateUrl: './exam-generator.html',
  styleUrl: './exam-generator.scss',
})
export class ExamGenerator {
  public practiceExam = inject(PracticeExam);

  isExamStarted = signal<boolean>(this.practiceExam.totalQuestions() > 0);

  resetAndNew() {
    this.practiceExam.resetExam();
  }
}
