import { computed, Injectable, signal } from '@angular/core';

interface QuestionExamState {
  [question_id: string]: AnswerDetail;
}

interface AnswerDetail {
  answer: string;
  isCorrect: boolean;
  index: number;
}

export interface ExamState {
  questions: QuestionExamState;
  score: number;
  total: number;
  categories: string[];
}

export interface HistoricalAnswer {
  question: string;
  answer: string;
  correctAnswer: string;
}

export interface HistoricalExam {
  date: string;
  numberOfQuestions: number;
  numberOfQuestionSucceeded: number;
  durationSeconds: number;
  answers: HistoricalAnswer[];
}

export interface GlobalStatsState {
  examens: HistoricalExam[];
}

@Injectable({
  providedIn: 'root',
})
export class PracticeExam {
  private readonly localStorageKey = 'currentExam';
  private readonly statsStorageKey = 'globalStats';
  private examStartTime: number = Date.now();

  currentIdx = signal<number>(0);
  selectedCategories = signal<string[]>([]);
  totalQuestions = signal<number>(0);
  answers = signal<Map<string, AnswerDetail>>(new Map());
  score = signal<number>(0);

  globalHistory = signal<GlobalStatsState>(this.loadGlobalHistory());

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
      try {
        const state = JSON.parse(saved);
        this.score.set(state.score || 0);
        this.totalQuestions.set(state.total || 0);
        this.selectedCategories.set(state.categories || []);
        this.currentIdx.set(state.currentIdx || 0);

        // Conversion de l'objet {} en Map() pour le signal
        const savedMap = new Map<string, AnswerDetail>(Object.entries(state.questions));
        this.answers.set(savedMap);
        this.examStartTime = state.startTime || Date.now();
      } catch (error: any) {
        console.error('Erreur de lecture du localStorage :', error);
      }
    }
  }

  startNewExam(quantity: number, categories: string[]) {
    localStorage.removeItem(this.localStorageKey);
    this.examStartTime = Date.now();

    this.selectedCategories.set(categories);
    this.currentIdx.set(0);
    this.totalQuestions.set(quantity);
    this.answers.set(new Map());
    this.score.set(0);

    const initialState = {
      questions: {},
      score: 0,
      total: quantity,
      categories: categories,
      currentIdx: 0,
      startTime: this.examStartTime,
    };
    localStorage.setItem(this.localStorageKey, JSON.stringify(initialState));
  }

  goToNextQuestion() {
    this.currentIdx.update((idx) => idx + 1);
    this.saveCurrentExam();
  }

  //Met à jour une seule réponse sans effacer le reste
  private saveCurrentExam() {
    const state = {
      questions: Object.fromEntries(this.answers()),
      score: this.score(),
      total: this.totalQuestions(),
      categories: this.selectedCategories(),
      currentIdx: this.currentIdx(),
      startTime: this.examStartTime,
    };
    localStorage.setItem(this.localStorageKey, JSON.stringify(state));
  }

  updateAnswer(question_id: string, answer: string, isCorrect: boolean): void {
    this.answers.update((prev) => {
      const newMap = new Map(prev);

      newMap.set(question_id, {
        answer,
        isCorrect,
        index: this.currentIdx(),
      });
      return newMap;
    });

    if (isCorrect) {
      this.score.update((v) => v + 1);
    }
    this.saveCurrentExam();
  }

  // --- LOGIQUE DE L'HISTORIQUE GLOBAL ---
  private loadGlobalHistory(): GlobalStatsState {
    const saved = localStorage.getItem(this.statsStorageKey);
    // Initialise avec un tableau vide d'examens si rien n'existe
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed && parsed.examens ? parsed : { examens: [] };
      } catch {
        return { examens: [] };
      }
    }
    return { examens: [] };
  }

  finalizeAndSaveExam(allQuestionsData: any[]): void {
    const endTime = Date.now();
    const durationSeconds = Math.round((endTime - this.examStartTime) / 1000);

    // 1. Convertir les réponses en format d'historique
    const historicalAnswers: HistoricalAnswer[] = [];

    this.answers().forEach((value, questionId) => {
      // Retrouver la question originale pour avoir la bonne réponse (correct_answer_french)
      const originalQuestion = allQuestionsData.find((q) => q.question_id === questionId);

      historicalAnswers.push({
        question: questionId,
        answer: value.answer,
        correctAnswer: originalQuestion ? originalQuestion.correct_answer_french : '',
      });
    });

    // 2. Créer le nouvel objet Examen
    const newExamRecord: HistoricalExam = {
      date: new Date().toISOString().split('T')[0], // Donne "YYYY-MM-DD"
      numberOfQuestions: this.totalQuestions(),
      numberOfQuestionSucceeded: this.score(),
      durationSeconds: durationSeconds,
      answers: historicalAnswers,
    };

    // 3. Mettre à jour le signal global et le localStorage
    this.globalHistory.update((currentStats) => {
      // On s'assure qu'on ne garde pas de vieux résidus étranges
      const currentExamsList = currentStats && currentStats.examens ? currentStats.examens : [];

      const updatedStats = {
        examens: [...currentExamsList, newExamRecord],
      };

      localStorage.setItem(this.statsStorageKey, JSON.stringify(updatedStats));
      return updatedStats;
    });

    // Nettoyer l'examen courant puisqu'il est terminé et archivé
    localStorage.removeItem(this.localStorageKey);
  }

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
