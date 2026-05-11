import { computed, Injectable, signal } from '@angular/core';

interface QuestionExamState {
  [question_id: string]: AnswerDetail; // questionId -> réponse sélectionnée
}

interface AnswerDetail {
  answer: string;
  isCorrect: boolean;
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
  private readonly statsStorageKey = 'globalStats';

  currentIdx = signal<number>(0);
  selectedCategories = signal<string[]>([]);
  totalQuestions = signal<number>(0);
  answers = signal<Map<string, AnswerDetail>>(new Map());
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
    console.log('📦 Données brutes du Storage :', saved);
    if (saved) {
      try {
        const state: ExamState = JSON.parse(saved);
        // On remplit les signals avec ce qu'on a trouvé
        this.score.set(state.score || 0);
        this.totalQuestions.set(state.total || 0);
        this.selectedCategories.set(state.categories || []);

        // Conversion de l'objet {} en Map() pour le signal
        const savedMap = new Map<string, AnswerDetail>(Object.entries(state.questions));
        this.answers.set(savedMap);
        console.log('✅ État restauré avec succès :', state);
      } catch (error: any) {
        // Ajoute ": any" ou ": unknown" ici
        console.error('❌ Erreur de lecture du localStorage :', error);
      }
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
  private saveCurrentExam() {
    const state = {
      questions: Object.fromEntries(this.answers()),
      score: this.score(),
      total: this.totalQuestions(),
      categories: this.selectedCategories(),
    };
    localStorage.setItem(this.localStorageKey, JSON.stringify(state));
  }

  updateAnswer(question_id: string, answer: string, isCorrect: boolean): void {
    this.answers.update((prev) => {
      const newMap = new Map(prev);
      newMap.set(question_id, { answer, isCorrect });
      return newMap;
    });

    if (isCorrect) {
      this.score.update((v) => v + 1);
    }
    this.saveCurrentExam();

    this.updateGlobalHistory(question_id, isCorrect);
  }

  globalHistory = signal<Record<string, boolean>>(this.loadGlobalHistory());

  private loadGlobalHistory(): Record<string, boolean> {
    const saved = localStorage.getItem(this.statsStorageKey);
    return saved ? JSON.parse(saved) : {};
  }

  private updateGlobalHistory(questionId: string, isCorrect: boolean) {
    this.globalHistory.update((history) => {
      const newHistory = { ...history, [questionId]: isCorrect };
      localStorage.setItem(this.statsStorageKey, JSON.stringify(newHistory));
      return newHistory;
    });
    const state: ExamState = {
      questions: Object.fromEntries(this.answers()) as QuestionExamState,
      score: this.score(),
      total: this.totalQuestions(),
      categories: this.selectedCategories(),
    };
    localStorage.setItem(this.localStorageKey, JSON.stringify(state));
  }

  // const saved = localStorage.getItem(this.statsStorageKey);
  // const history = saved ? JSON.parse(saved) : {};

  // history[questionId] = isCorrect;

  // localStorage.setItem(this.statsStorageKey, JSON.stringify(history));

  // const state: ExamState = {
  //   questions: Object.fromEntries(this.answers()) as QuestionExamState, // Convertit la Map en objet
  //   score: this.score(),
  //   total: this.totalQuestions(),
  //   categories: this.selectedCategories(),
  // };
  // localStorage.setItem(this.localStorageKey, JSON.stringify(state));
  //}

  public isFinished = computed(() => {
    const total = this.totalQuestions();
    const answered = this.answers().size;
    return total > 0 && answered === total;
  });

  // Méthode pour tout nettoyer et revenir au début
  resetExam() {
    localStorage.removeItem(this.localStorageKey);
    this.totalQuestions.set(0);
    this.answers.set(new Map());
    this.score.set(0);
    this.currentIdx.set(0);
  }
}
