import { Injectable, signal } from '@angular/core';

interface QuestionExamState {
  [question_id: string]: string; // questionId -> réponse sélectionnée
}

export interface ExamState {
  questions: QuestionExamState;
  score: number;
}

@Injectable({
  providedIn: 'root',
})
export class PracticeExam {
  selectedCategories = signal<string[]>([]);
  currentIdx = signal<number>(0);
  totalQuestions = signal<number>(0);
  localStorageKey = 'currentExam'; // Public par défaut, accessible partout

  startNewExam(numberOfQuestions: number, categories: string[]) {
    // On mémorise les catégories dans le signal
    this.totalQuestions.set(numberOfQuestions);
    this.selectedCategories.set(categories);
    this.currentIdx.set(0);

    console.log(`✅ Service : Examen démarré avec ${numberOfQuestions} questions.`);

    const initialState: ExamState = {
      questions: {},
      score: 0,
    };
    this.saveExamState(initialState);
    console.log(
      `✅ Examen initialisé : ${numberOfQuestions} questions, catégories : ${categories.join(', ')}`,
    );
  }

  goToNextQuestion() {
    this.currentIdx.update((val) => val + 1);
  }

  resetExam() {
    this.totalQuestions.set(0);
    this.currentIdx.set(0);
    this.selectedCategories.set([]);
  }

  constructor() {
    // this.testService();
  }

  // Logique pour démarrer un nouvel examen avec le nombre de questions et les catégories sélectionnées
  // startNewExam(numberOfQuestions: number, categories: string[]) {
  //   console.log(
  //     `Démarrage d'un nouvel examen avec ${numberOfQuestions} questions dans les catégories: ${categories.join(', ')}`,
  //   );
  //   const initialState: ExamState = {
  //     questions: {},
  //     score: 0,
  //   };

  //   this.saveExamState(initialState);
  // }

  // Logique pour sauvegarder la réponse de l'utilisateur
  saveExamState(state: ExamState): void {
    localStorage.setItem(this.localStorageKey, JSON.stringify(state));
  }

  //Récupère l'état sauvegardé (Conversion String JSON -> Objet)
  getExamState(): ExamState | null {
    const saved = localStorage.getItem(this.localStorageKey);
    return saved ? JSON.parse(saved) : null;
  }

  //Met à jour une seule réponse sans effacer le reste
  updateAnswer(question_id: string, answer: string): void {
    const currentState = this.getExamState();
    if (currentState) {
      currentState.questions[question_id] = answer;
      this.saveExamState(currentState);
    }
  }

  /// Si question on retourne la réponse, sinon null
  getSavedAnswerForQuestion(question_id: string): string | null {
    const state = this.getExamState();

    if (state && state.questions && state.questions[question_id]) {
      return state.questions[question_id];
    }

    return null;
  }
}
