import { Component, signal, input, effect, output } from '@angular/core';
import { ServiceQuestions } from '../../../services/service-questions';
import { PracticeExam } from '../../../services/practice-exam';
import { Button } from '../../shared/button/button';
import { Title } from '../title/title';
import { Questions } from '../../../interfaces/questions';

@Component({
  selector: 'app-exam-display',
  imports: [Button, Title],
  templateUrl: './exam-display.html',
  styleUrl: './exam-display.scss',
})
export class ExamDisplay {
  questionData = input.required<Questions>();
  nextRequested = output<void>();

  currentAnswers = signal<string[]>([]);
  selectedAnswer = signal<string>('');
  feedback = signal<string>(''); // Message de succès ou d'erreur
  hasValidated = signal<boolean>(false);

  constructor(
    private questionService: ServiceQuestions,
    public practiceExam: PracticeExam,
  ) {
    effect(() => {
      //// Observateur - surveille tout changement nettoie l'interface pour la prochaine question
      const q = this.questionData();
      this.resetDisplay(q);
    });
  }

  onSelect(answer: string) {
    // On ne permet de changer la sélection que si on n'a pas encore validé
    if (!this.hasValidated()) {
      this.selectedAnswer.set(answer);
    }
  }

  private resetDisplay(q: Questions) {
    this.selectedAnswer.set('');
    this.feedback.set('');
    this.hasValidated.set(false);

    this.questionService.getRandomizedAnswersForQuestion(q.question_id).subscribe((answers) => {
      this.currentAnswers.set(answers);
    });
  }

  // La fonction pour vérifier les réponses
  verifierReponse() {
    const q = this.questionData();
    if (!this.selectedAnswer() || this.hasValidated()) return;

    const isCorrect = this.questionService.isCorrect(q, this.selectedAnswer(), 'fr');

    this.feedback.set(
      isCorrect ? '✅ Bonne réponse !' : `❌ Erreur. La réponse était : ${q.correct_answer_french}`,
    );

    // Sauvegarde dans le service/LocalStorage
    this.practiceExam.updateAnswer(q.question_id, this.selectedAnswer());
    this.hasValidated.set(true);
  }

  onNext() {
    this.nextRequested.emit();
  }

  getLetter(index: number): string {
    return String.fromCharCode(65 + index);
  }
}
