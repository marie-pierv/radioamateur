import { Component, inject, signal } from '@angular/core';
import { ScoreBreakdown } from '../../shared/score-breakdown/score-breakdown';
import { Quicklinks } from '../../shared/quicklinks/quicklinks';
import { Card } from '../../shared/card/card';
import { Title } from '../../shared/title/title';
import { LevelIndicator } from '../../shared/level-indicator/level-indicator';
import { ActivatedRoute } from '@angular/router';
import { InterfaceQuickLinks } from '../../../interfaces/interface-quicklinks';

@Component({
  selector: 'app-exam-finish',
  imports: [ScoreBreakdown, Quicklinks, Card, Title, LevelIndicator],
  templateUrl: './exam-finish.html',
  styleUrl: './exam-finish.scss',
})
export class ExamFinish {
  private route = inject(ActivatedRoute);
  dashboardLinks = signal<InterfaceQuickLinks[]>([]);

  ngOnInit(): void {
    // On récupère les liens définis dans le 'data' de cette route (dashboard)
    const data = this.route.parent?.snapshot.data['quicklinks'];

    if (data) {
      this.dashboardLinks.set(data);
    }
  }
}
