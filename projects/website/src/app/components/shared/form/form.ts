import { Component, OnInit, signal, model } from '@angular/core';
import { ServiceQuestions } from '../../../services/service-questions';
import { PracticeExam } from '../../../services/practice-exam';
import { Label } from '../../shared/label/label';
import { Button } from '../../shared/button/button';

@Component({
  selector: 'app-form',
  imports: [Button, Label],
  templateUrl: './form.html',
  styleUrl: './form.scss',
})
export class Form implements OnInit {
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

  selectedCategory = model<string>('');
  currentQuestionLabel = signal<string>('');
  currentAnswers = signal<string[]>([]);
  selectedAnswer = signal<string>('');
  feedback = signal<string>(''); // Message de succès ou d'erreur
  currentId = '';
  quantity = model<number>(10);
  examEnd = signal<boolean>(false);
  questionsAnswered = signal<number>(0);
  hasValidated = signal<boolean>(false);

  getLetter(index: number): string {
    return String.fromCharCode(65 + index); /// 65 = A
  }

  onSelect(answer: string) {
    if (!this.hasValidated()) {
      this.selectedAnswer.set(answer);
    }
  }

  constructor(
    private questionService: ServiceQuestions,
    public practiceExam: PracticeExam,
  ) {}

  ngOnInit() {
    const cat = this.selectedCategory() || this.practiceExam.selectedCategories()[0];

    if (cat) {
      this.selectedCategory.set(cat);

      this.startExam();
    }
  }

  startExam() {
    const cat = this.selectedCategory();
    if (!cat) return;

    this.examEnd.set(false);
    this.questionsAnswered.set(0);
    this.hasValidated.set(false);
    this.feedback.set('');
    this.practiceExam.startNewExam(this.quantity(), [cat]);

    this.loadQuestion(cat);
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

    this.loadQuestion(this.selectedCategory());
  }
  // On utilise ton service spécialisé pour les catégories
  private loadQuestion(cat: string) {
    this.questionService.getRandomQuestionOfCategory(cat).subscribe((id) => {
      if (id) {
        this.currentId = id;
        this.questionService.getLabelForQuestion(id).subscribe((label) => {
          this.currentQuestionLabel.set(label);
        });

        // Charger les réponses mélangées
        this.questionService.getRandomizedAnswersForQuestion(id).subscribe((answers) => {
          this.currentAnswers.set(answers);
        });
      }
    });
  }

  // La fonction pour vérifier les réponses
  verifierReponse() {
    if (!this.selectedAnswer() || this.hasValidated()) return;

    this.questionService.getQuestions().subscribe((questions) => {
      const q = questions.find((item) => item.question_id === this.currentId);
      if (q) {
        const isCorrect = this.questionService.isCorrect(q, this.selectedAnswer(), 'fr');
        this.feedback.set(
          isCorrect
            ? '✅ Bonne réponse !'
            : `❌ Erreur. La réponse était : ${q.correct_answer_french}`,
        );
        this.practiceExam.updateAnswer(this.currentId, this.selectedAnswer());
        this.hasValidated.set(true);
      }
    });
  }
  onCategoryChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedCategory.set(selectElement.value);
  }

  onQuantityChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.quantity.set(parseInt(selectElement.value, 10));
  }
}
