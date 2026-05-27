import { Component, OnInit, signal } from '@angular/core';
import { ServiceQuestions } from '../../../services/service-questions';
import { PracticeExam } from '../../../services/practice-exam';
import { Button } from '../../shared/button/button';
import { Title } from '../title/title';

@Component({
  selector: 'app-exam-display',
  imports: [Button, Title],
  templateUrl: './exam-display.html',
  styleUrl: './exam-display.scss',
})
export class ExamDisplay implements OnInit {
  currentQuestionLabel = signal<string>('');
  currentAnswers = signal<string[]>([]);
  selectedAnswer = signal<string>('');
  feedback = signal<string>(''); // Message de succès ou d'erreur
  currentId = '';
  hasValidated = signal<boolean>(false);

  constructor(
    private questionService: ServiceQuestions,
    public practiceExam: PracticeExam,
  ) {}

  ngOnInit() {
    const categories = this.practiceExam.selectedCategories();
    const cat = categories.length > 0 ? categories[0] : '';

    // Au tout premier chargement, si l'examen est déjà fini, on ne fait rien
    if (this.practiceExam.isFinished()) return;

    // On charge la première question (l'index est déjà géré par le service au démarrage)
    if (cat) {
      this.loadQuestion(cat);
    }
  }

  loadNextQuestion() {
    this.practiceExam.goToNextQuestion();

    if (this.practiceExam.isFinished()) {
      console.log('Examen terminé, aucune autre question à charger.');
      return;
    }

    this.feedback.set('');
    this.selectedAnswer.set('');
    this.hasValidated.set(false);

    const categories = this.practiceExam.selectedCategories();
    const cat = categories.length > 0 ? categories[0] : '';
    if (cat) {
      this.loadQuestion(cat);
    }
  }

  getLetter(index: number): string {
    return String.fromCharCode(65 + index); /// 65 = A
  }

  onSelect(answer: string) {
    if (!this.hasValidated()) {
      this.selectedAnswer.set(answer);
    }
  }

  private loadQuestion(cat: string) {
    this.questionService.getRandomQuestionOfCategory(cat).subscribe((id) => {
      if (id) {
        this.currentId = id;
        this.questionService
          .getLabelForQuestion(id)
          .subscribe((l) => this.currentQuestionLabel.set(l));
        this.questionService
          .getRandomizedAnswersForQuestion(id)
          .subscribe((a) => this.currentAnswers.set(a));
      }
    });
  }

  verifierReponse() {
    if (!this.selectedAnswer() || this.hasValidated()) return;

    this.questionService.getQuestions().subscribe((questions) => {
      const q = questions.find((item) => item.question_id === this.currentId);
      if (q) {
        const isCorrect = this.questionService.isCorrect(q, this.selectedAnswer(), 'fr');

        this.feedback.set(
          isCorrect
            ? '✅ Bonne réponse!'
            : `❌ Erreur! La bonne réponse est : ${q.correct_answer_french}`,
        );

        // On met à jour le service
        this.practiceExam.updateAnswer(this.currentId, this.selectedAnswer(), isCorrect);
        this.hasValidated.set(true);

        if (this.practiceExam.isFinished()) {
          console.log('Dernière question répondue. Sauvegarde dans globalStats...');
          this.practiceExam.finalizeAndSaveExam(questions);
        }
      }
    });
  }
}
