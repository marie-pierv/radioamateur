import { Component } from '@angular/core';
import { Card } from '../../shared/card/card';
import { ExamManager } from '../../shared/exam-manager/exam-manager';
import { ExamDisplay } from '../../shared/exam-display/exam-display';
import { FormStartExam } from '../../shared/form-start-exam/form-start-exam';
import { ExamProgress } from '../../shared/exam-progress/exam-progress';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-exam-generator',
  standalone: true,
  imports: [RouterOutlet, FormStartExam, Card, ExamDisplay, ExamProgress, ExamManager],
  templateUrl: './exam-generator.html',
  styleUrl: './exam-generator.scss',
})
export class ExamGenerator {}
