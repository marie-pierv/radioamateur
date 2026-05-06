import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Button } from '../button/button';
import { PracticeExam } from '../../../services/practice-exam';
import { Card } from '../card/card';
import { ExamProgress } from '../exam-progress/exam-progress';
import { FormStartExam } from '../form-start-exam/form-start-exam';
import { ExamDisplay } from '../exam-display/exam-display';

@Component({
  selector: 'app-exam-manager',
  imports: [CommonModule, Button, Card, ExamProgress, FormStartExam, ExamDisplay],
  templateUrl: './exam-manager.html',
  styleUrl: './exam-manager.scss',
})
export class ExamManager {
  public practiceExam = inject(PracticeExam);

  // --- États de la session ---
  isStarted = signal<boolean>(false);
  isFinished = signal<boolean>(false);

  onExamStarted() {
    this.isStarted.set(true);
    this.isFinished.set(false);
  }

  reset() {
    this.isStarted.set(false);
    this.isFinished.set(false);
  }
}
