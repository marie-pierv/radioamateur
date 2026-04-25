import { Component, inject, OnInit, output, signal } from '@angular/core';
import { PracticeExam } from '../../../services/practice-exam';
import { Button } from '../button/button';
import { ExamDisplay } from '../exam-display/exam-display';
import { Title } from '../title/title';

@Component({
  selector: 'app-form-start-exam',
  standalone: true,
  imports: [Button, ExamDisplay, Title],
  templateUrl: './form-start-exam.html',
  styleUrl: './form-start-exam.scss',
})
export class FormStartExam implements OnInit {
  private practiceExam = inject(PracticeExam);
  // Cette partie à revoir
  categories = [
    { code: 'B-001', name: 'Règlements et politiques' },
    { code: 'B-002', name: 'Procédures d’exploitation' },
    { code: 'B-003', name: 'Modes de transmission' },
    { code: 'B-004', name: 'Circuits et composants' },
    { code: 'B-005', name: 'Signaux et mesures' },
    { code: 'B-006', name: 'Antennes et lignes' },
    { code: 'B-007', name: 'Propagation' },
    { code: 'B-008', name: 'Brouillage et sécurité' },
    // Ajoute les autres ici...
  ];

  onStart = output<void>(); //Communique avec parent

  selectedCategory = signal<string>('');
  currentQuestionLabel = signal<string>('');
  currentAnswers = signal<string[]>([]);
  selectedAnswer = signal<string>('');
  feedback = signal<string>(''); // Message de succès ou d'erreur
  currentId = '';
  quantity = signal<number>(50);
  examEnd = signal<boolean>(false);
  questionsAnswered = signal<number>(0);
  hasValidated = signal<boolean>(false);
  isExamStarted = signal<boolean>(false);

  ngOnInit() {}

  startExam() {
    if (this.selectedCategory()) {
      this.practiceExam.startNewExam(this.quantity(), [this.selectedCategory()]);

      this.isExamStarted.set(true);
      this.examEnd.set(false);
      this.questionsAnswered.set(0);
      this.hasValidated.set(false);
      this.feedback.set('');

      // Prévient le parent
      this.onStart.emit();
    }
  }
  reset() {
    this.isExamStarted.set(false);
    this.examEnd.set(false);
    this.selectedCategory.set('');
  }

  loadQuestionByCategory() {
    //Compteur
    this.questionsAnswered.update((n) => n + 1);
    if (this.questionsAnswered() >= this.quantity()) {
      this.examEnd.set(true);
      return;
    }
    this.feedback.set('');
    this.selectedAnswer.set('');
    this.hasValidated.set(false);
  }

  onCategoryChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedCategory.set(selectElement.value);
  }
  onQuantityChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.quantity.set(Number(value));
  }
}
