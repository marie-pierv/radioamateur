import { Component, inject, OnInit, output, signal } from '@angular/core';
import { PracticeExam } from '../../../services/practice-exam';
import { Button } from '../button/button';
import { ExamDisplay } from '../exam-display/exam-display';
import { Title } from '../title/title';

@Component({
  selector: 'app-form-start-exam',
  standalone: true,
  imports: [Button, ExamDisplay, Title],
  templateUrl: './form-start-exam.html',
  styleUrl: './form-start-exam.scss',
})
export class FormStartExam {
  private practiceExam = inject(PracticeExam);

  onStart = output<void>();

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

  selectedCategory = signal<string>('');
  quantity = signal<number>(10);
  isExamStarted = signal<boolean>(false);

  startExam() {
    if (this.selectedCategory()) {
      this.practiceExam.startNewExam(this.quantity(), [this.selectedCategory()]);

      this.isExamStarted.set(true);

      // Prévient le parent
      this.onStart.emit();
    }
  }

  onCategoryChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedCategory.set(selectElement.value);
  }
  onQuantityChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.quantity.set(Number(value));
  }
  reset() {
    this.isExamStarted.set(false);
    this.selectedCategory.set('');
  }
}
