import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Question } from '../question/question';
import { Button } from '../button/button';
import { ServiceQuestions } from '../../../services/service-questions';
import { PracticeExam } from '../../../services/practice-exam';
import { Questions } from '../../../interfaces/questions';

@Component({
  selector: 'app-exam-manager',
  imports: [CommonModule, Question, Button],
  templateUrl: './exam-manager.html',
  styleUrl: './exam-manager.scss',
})
export class ExamManager {
  private questionService = inject(ServiceQuestions);
  private practiceExam = inject(PracticeExam);

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

  startExam() {
    this.questionService.getQuestions().subscribe((allQuestions) => {
      // 1. Filtrer par catégorie
      const filtered = allQuestions.filter((q) =>
        q.question_id.startsWith(this.selectedCategory()),
      );

      // 2. Mélanger et limiter la quantité
      const shuffled = [...filtered].sort(() => Math.random() - 0.5);
      this.sessionQuestions.set(shuffled.slice(0, this.quantity()));

      // 3. Initialiser le service de suivi
      this.practiceExam.startNewExam(this.sessionQuestions().length, [this.selectedCategory()]);

      this.currentIndex.set(0);
      this.isStarted.set(true);
      this.isFinished.set(false);
    });
  }

  handleAnswer(answerText: string) {
    const currentQ = this.sessionQuestions()[this.currentIndex()];
    if (currentQ) {
      // On enregistre la réponse dans le service PracticeExam
      this.practiceExam.updateAnswer(currentQ.question_id, answerText);
    }
  }

  goToNext() {
    if (this.currentIndex() < this.sessionQuestions().length - 1) {
      this.currentIndex.update((v) => v + 1);
    } else {
      this.isFinished.set(true);
    }
  }

  reset() {
    this.isStarted.set(false);
    this.isFinished.set(false);
  }
}
