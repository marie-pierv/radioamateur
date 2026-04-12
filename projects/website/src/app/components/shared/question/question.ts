import { CommonModule } from '@angular/common';
import { Component, input, output, signal, computed } from '@angular/core';
import { Button } from '../button/button';
import { Questions } from '../../../interfaces/questions';
import { Title } from '../title/title';

@Component({
  selector: 'app-question',
  imports: [Button, Title],
  templateUrl: './question.html',
  styleUrl: './question.scss',
})
export class Question {
  // Données venant de exam-manager
  questionData = input.required<Questions>();
  showResultAtSelection = input<boolean>(true);

  //Outputs - actions envoyées a exam-manager
  validatedAnswer = output<string>();
  nextRequested = output<void>();

  // États locaux
  selectedOption = signal<any | null>(null);
  hasValidated = signal<boolean>(false);

  // mélange les options dès que la question change
  options = computed(() => {
    const q = this.questionData();

    const allOptions = [
      { text: q.correct_answer_french, isCorrect: true },
      { text: q.incorrect_answer_1_french, isCorrect: false },
      { text: q.incorrect_answer_2_french, isCorrect: false },
      { text: q.incorrect_answer_3_french, isCorrect: false },
    ];

    // Random
    const shuffled = [...allOptions].sort(() => Math.random() - 0.5);

    // Ajout des labels A, B, C, D après le mélange
    return shuffled.map((opt, index) => ({
      ...opt,
      label: ['A', 'B', 'C', 'D'][index],
    }));
  });

  onSelect(option: any) {
    if (!this.hasValidated()) {
      this.selectedOption.set(option);
    }
  }

  onValidate() {
    if (this.selectedOption()) {
      this.hasValidated.set(true);
      this.validatedAnswer.emit(this.selectedOption().text);
    }
  }

  onNext() {
    this.nextRequested.emit();
    // Reset de l'état local
    this.selectedOption.set(null);
    this.hasValidated.set(false);
  }
}
