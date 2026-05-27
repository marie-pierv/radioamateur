import { Component } from '@angular/core';
import { ScoreBreakdown } from '../../shared/score-breakdown/score-breakdown';
import { Quicklinks } from '../../shared/quicklinks/quicklinks';
import { Card } from '../../shared/card/card';
import { Title } from '../../shared/title/title';
import { LevelIndicator } from '../../shared/level-indicator/level-indicator';

@Component({
  selector: 'app-exam-finish',
  imports: [ScoreBreakdown, Quicklinks, Card, Title, LevelIndicator],
  templateUrl: './exam-finish.html',
  styleUrl: './exam-finish.scss',
})
export class ExamFinish {}
