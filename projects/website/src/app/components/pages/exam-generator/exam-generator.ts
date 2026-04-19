import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PracticeExam } from '../../../services/practice-exam';
import { Card } from '../../shared/card/card';
import { ExamDisplay } from '../../shared/exam-display/exam-display';
import { FormStartExam } from '../../shared/form-start-exam/form-start-exam';
import { ExamProgress } from '../../shared/exam-progress/exam-progress';

@Component({
  selector: 'app-exam-generator',
  standalone: true,
  imports: [RouterOutlet, FormStartExam, Card, ExamDisplay, ExamProgress],
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

  startExam(data: { category: string; quantity: number }) {
    console.log('Data reçue du formulaire :', data);
    if (!data) {
      console.error("ERREUR : L'objet data est undefined !");
      return;
    }
    this.quantity.set(data.quantity);
    this.selectedCategory.set(data.category);
    this.practiceExam.startNewExam(data.quantity, [data.category]);
    this.isExamStarted.set(true);
  }
  onExamFinished() {
    this.isExamStarted.set(false);
    this.examEnd.set(true);
  }
}
