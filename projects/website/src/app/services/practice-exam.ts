import { computed, Injectable, signal } from '@angular/core';

interface QuestionExamState {
  [question_id: string]: string; // questionId -> réponse sélectionnée
}

export interface ExamState {
  questions: QuestionExamState;
  score: number;
  total: number;
  categories: string[];
}

@Injectable({
  providedIn: 'root',
})
export class PracticeExam {
  private readonly localStorageKey = 'currentExam';

  currentIdx = signal<number>(0);
  selectedCategories = signal<string[]>([]);
  totalQuestions = signal<number>(0);
  answers = signal<Map<string, string>>(new Map());
  score = signal<number>(0);

  // Nombre de questions répondues
  countAnswered = computed(() => this.answers().size);
  progressPercent = computed(() => {
    const total = this.totalQuestions();
    return total > 0 ? (this.countAnswered() / total) * 100 : 0;
  });

  successRate = computed(() => {
    const answered = this.countAnswered();
    return answered > 0 ? (this.score() / answered) * 100 : 0;
  });

  correctAnswersCount = computed(() => this.score());

  constructor() {
    this.loadFromStorage();
  }
  private loadFromStorage() {
    const saved = localStorage.getItem(this.localStorageKey);
    if (saved) {
      const state: ExamState = JSON.parse(saved);
      // On remplit les signals avec ce qu'on a trouvé
      this.score.set(state.score || 0);
      this.totalQuestions.set(state.total || 0);
      this.selectedCategories.set(state.categories || []);

      // Conversion de l'objet {} en Map() pour le signal
      const savedMap = new Map(Object.entries(state.questions));
      this.answers.set(savedMap);
    }
  }

  startNewExam(quantity: number, categories: string[]) {
    console.log('🚀 BOOM ! Quantité reçue :', quantity);
    localStorage.removeItem(this.localStorageKey);
    // Mémorise les catégories dans le signa
    this.selectedCategories.set(categories);
    this.currentIdx.set(0);
    this.selectedCategories.set(categories);
    this.totalQuestions.set(quantity);
    this.answers.set(new Map());
    this.score.set(0);

    const initialState: ExamState = {
      questions: {},
      score: 0,
      total: quantity,
      categories: categories,
    };
    localStorage.setItem(this.localStorageKey, JSON.stringify(initialState));
    //this.saveExamState(initialState);
  }

  // Logique pour sauvegarder la réponse de l'utilisateur
  saveExamState(state: ExamState): void {
    localStorage.setItem(this.localStorageKey, JSON.stringify(state));
  }

  //Met à jour une seule réponse sans effacer le reste
  updateAnswer(question_id: string, answer: string, isCorrect: boolean): void {
    this.answers.update((prev) => {
      const newMap = new Map(prev);
      newMap.set(question_id, answer);
      return newMap;
    });

    if (isCorrect) {
      this.score.update((v) => v + 1);
    }

    const state: ExamState = {
      questions: Object.fromEntries(this.answers()), // Convertit la Map en objet
      score: this.score(),
      total: this.totalQuestions(),
      categories: this.selectedCategories(),
    };
    localStorage.setItem(this.localStorageKey, JSON.stringify(state));
  }
}
