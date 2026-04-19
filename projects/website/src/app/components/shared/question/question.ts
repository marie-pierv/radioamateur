import { CommonModule } from '@angular/common';
import { UpperCasePipe } from '@angular/common';
import { Component, input, output, signal, computed } from '@angular/core';
import { Button } from '../button/button';
import { Questions } from '../../../interfaces/questions';

@Component({
  selector: 'app-question',
  imports: [Button, UpperCasePipe],
  templateUrl: './question.html',
  styleUrl: './question.scss',
})
export class Question {
  question = input.required<Questions>();
  showResultAtSelection = input<boolean>(false);

  // Outputs
  validatedAnswer = output<string>();
  next = output<void>();

  // États internes
  selectedAnswer = signal<string | null>(null);
  hasValidated = signal<boolean>(false);

  // Vérification de la réponse (pour showResultAtSelection est true)
  isCorrect = computed(() => {
    const q = this.question();
    return this.selectedAnswer() === q.correct_answer_french;
  });

  onSelect(letter: string) {
    if (this.hasValidated()) return; // Bloque après validation
    this.selectedAnswer.set(letter);
  }

  onValidate() {
    if (this.selectedAnswer()) {
      this.hasValidated.set(true);
      this.validatedAnswer.emit(this.selectedAnswer()!);
    }
  }

  onNext() {
    this.next.emit();
    // Reset interne pour la prochaine question injectée
    this.selectedAnswer.set(null);
    this.hasValidated.set(true); // Optionnel
  }
}
