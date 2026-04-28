import { Component } from '@angular/core';
import { Card } from '../../shared/card/card';
import { ExamManager } from '../../shared/exam-manager/exam-manager';

@Component({
  selector: 'app-exam-generator',
  standalone: true,
  imports: [Card, ExamManager],
  templateUrl: './exam-generator.html',
  styleUrl: './exam-generator.scss',
})
export class ExamGenerator {}
