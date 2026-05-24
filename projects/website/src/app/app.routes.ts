import { Routes } from '@angular/router';
import { Home } from './components/pages/home/home';
import { Default } from './components/layouts/default/default';
import { ExamGenerator } from './components/pages/exam-generator/exam-generator';
import { Dashboard } from './components/layouts/dashboard/dashboard';
import { Outils } from './components/layouts/outils/outils';
import { ExamFinish } from './components/pages/exam-finish/exam-finish';
import { Quicklinks } from './components/shared/quicklinks/quicklinks';

export const routes: Routes = [
  {
    path: '',
    component: Default,
    children: [{ path: '', component: Home }],
  },
  {
    path: 'dashboard',
    component: Dashboard,
    children: [
      {
        path: 'examens',
        component: ExamGenerator,
      },
      {
        path: 'exam-finish',
        component: ExamFinish,
      },
      {
        path: 'outils',
        component: Outils,
        data: {
          quicklinks: [
            // {
            //   label: 'Réviser par chapitre',
            //   link: 'dashboard/outils',
            //   type: 'internal',
            // },
            // {
            //   label: 'Réviser les questions manquées',
            //   link: '/dashboard/revision',
            //   type: 'internal',
            // },
            // { label: "Faire une pratique d'examen", link: '/dashboard/examen', type: 'internal' }, // Outils a remplacer par le layout qui va afficher ses components
            // { label: 'Calculateurs', link: '/dashboard/calculateurs', type: 'internal' },
            // { label: 'Obtenir son certificat', link: 'https://rac.ca', type: 'external' },
          ],
        },
      },
    ],
  },
];
