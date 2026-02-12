import { Routes } from '@angular/router';
import { Dashboard } from './features/dashboard/dashboard';
import { ExerciseDashboard } from './features/exercise-dashboard/exercise-dashboard';

export const routes: Routes = [
    { path: '', component: Dashboard },
    { path: 'exercise', component: ExerciseDashboard },
    { path: '**', redirectTo: '' }
];
