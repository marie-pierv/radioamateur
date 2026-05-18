import { Component } from '@angular/core';
import { ScoreBreakdown } from '../../shared/score-breakdown/score-breakdown';
import { Quicklinks } from '../../shared/quicklinks/quicklinks';
import { Card } from '../../shared/card/card';

@Component({
  selector: 'app-exam-finish',
  imports: [ScoreBreakdown, Quicklinks, Card],
  templateUrl: './exam-finish.html',
  styleUrl: './exam-finish.scss',
})
export class ExamFinish {}
