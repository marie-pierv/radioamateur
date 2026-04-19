import { Component, OnInit, output, signal } from '@angular/core';
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
export class FormStartExam implements OnInit {
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

  onStart = output<{ category: string; quantity: number }>();
  selectedCategory = signal<string>('');
  quantity = signal<number>(10);
  examEnd = signal<boolean>(false);
  isExamStarted = signal<boolean>(false);

  constructor(public practiceExam: PracticeExam) {}

  ngOnInit() {}

  startExam() {
    const cat = this.selectedCategory();
    const qty = this.quantity();

    if (!cat) return;

    this.practiceExam.startNewExam(qty, [cat]);

    this.onStart.emit({
      category: cat,
      quantity: qty,
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
