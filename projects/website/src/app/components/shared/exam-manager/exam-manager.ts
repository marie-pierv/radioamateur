import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Button } from '../button/button';
import { ServiceQuestions } from '../../../services/service-questions';
import { PracticeExam } from '../../../services/practice-exam';
import { Questions } from '../../../interfaces/questions';
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
  constructor(public practiceExam: PracticeExam) {}

  private questionService = inject(ServiceQuestions);

  // --- États de la session ---
  isStarted = signal<boolean>(false);
  isFinished = signal<boolean>(false);

  // Liste des questions filtrées pour la session actuelle
  sessionQuestions = signal<Questions[]>([]);
  currentIndex = signal<number>(0);

  // --- Configuration (Formulaire) ---
  selectedCategory = signal<string>('B-001');
  quantity = signal<number>(10);

  // Catégories (charger depuis un service à tester)
  categories = [
    { code: 'B-001', name: 'Règlements et politiques' },
    { code: 'B-002', name: 'Procédures d’exploitation' },
    { code: 'B-003', name: 'Modes de transmission' },
    { code: 'B-004', name: 'Circuits et composants' },
    { code: 'B-005', name: 'Signaux et mesures' },
    { code: 'B-006', name: 'Antennes et lignes' },
    { code: 'B-007', name: 'Propagation' },
    { code: 'B-008', name: 'Brouillage et sécurité' },
  ];

  startExam(data: { category: string; quantity: number }) {
    this.selectedCategory.set(data.category);
    this.quantity.set(data.quantity);

    this.questionService.getQuestions().subscribe((allQuestions) => {
      const filtered = allQuestions.filter((q) => q.question_id.startsWith(data.category));

      const shuffled = [...filtered].sort(() => Math.random() - 0.5);
      const selectedQuestions = shuffled.slice(0, data.quantity);

      this.sessionQuestions.set(selectedQuestions);

      this.practiceExam.startNewExam(selectedQuestions.length, [data.category]);

      this.currentIndex.set(0);
      this.isStarted.set(true);
      this.isFinished.set(false);
    });
  }

  handleAnswer(answerText: string) {
    const currentQ = this.sessionQuestions()[this.currentIndex()];
    if (currentQ) {
      const isCorrect = this.questionService.isCorrect(currentQ, answerText, 'fr');
      // On enregistre la réponse dans le service PracticeExam
      this.practiceExam.updateAnswer(currentQ.question_id, answerText, isCorrect);
    }
  }

  goToNext() {
    if (this.currentIndex() < this.sessionQuestions().length - 1) {
      this.currentIndex.update((v) => v + 1);
      this.practiceExam.currentIdx.set(this.currentIndex());
    } else {
      this.isFinished.set(true);
    }
  }

  reset() {
    this.isStarted.set(false);
    this.isFinished.set(false);
  }
}
