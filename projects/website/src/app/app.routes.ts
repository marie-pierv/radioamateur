import { Routes } from '@angular/router';
import { Home } from './components/pages/home/home';
import { Default } from './components/layouts/default/default';
import { ExamGenerator } from './components/pages/exam-generator/exam-generator';
import { Dashboard } from './components/layouts/dashboard/dashboard';

export const routes: Routes = [
  {
    path: '',
    component: Default,
    children: [
      { path: '', component: Home },
      // { path: 'examens', component: ExamGenerator },
    ],
  },
  {
    path: 'dashboard',
    component: Dashboard, // Ton nouveau template avec Sidebar, etc.
    children: [{ path: 'examens', component: ExamGenerator }],
  },
];
