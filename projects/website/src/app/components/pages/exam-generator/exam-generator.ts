import { Component, OnInit, signal, Input } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ServiceQuestions } from '../../../services/service-questions';
import { PracticeExam } from '../../../services/practice-exam';
import { Label } from '../../shared/label/label';
import { Button } from '../../shared/button/button';
import { Form } from '../../shared/form/form';
import { ExamSetup } from '../../shared/exam-setup/exam-setup';
import { Card } from '../../shared/card/card';
import { Quicklinks } from '../../shared/quicklinks/quicklinks';

@Component({
  selector: 'app-exam-generator',
  standalone: true,
  imports: [RouterOutlet, Label, Button, Form, ExamSetup, Card, Quicklinks],
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
