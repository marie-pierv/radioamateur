import { Component, OnInit, signal, Input } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PracticeExam } from '../../../services/practice-exam';
import { Button } from '../../shared/button/button';
import { Card } from '../../shared/card/card';
import { ExamDisplay } from '../../shared/exam-display/exam-display';
import { FormStartExam } from '../../shared/form-start-exam/form-start-exam';

@Component({
  selector: 'app-exam-generator',
  standalone: true,
  imports: [RouterOutlet, Button, FormStartExam, Card, ExamDisplay],
  templateUrl: './exam-generator.html',
  styleUrl: './exam-generator.scss',
})
export class ExamGenerator implements OnInit {
  isExamStarted = signal<boolean>(false);
  selectedCategory = signal<string>('');
  quantity = signal<number>(10);
  examEnd = signal<boolean>(false);

  constructor(public practiceExam: PracticeExam) {}
  ngOnInit() {}

  startExam() {
    if (!this.selectedCategory()) return;

    this.isExamStarted.set(true);
    this.examEnd.set(false);

    this.practiceExam.startNewExam(this.quantity(), [this.selectedCategory()]);
  }
  onExamFinished() {
    this.isExamStarted.set(false);
    this.examEnd.set(true);
  }
}
