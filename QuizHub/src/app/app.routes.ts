import { Routes } from '@angular/router';
import { LoginComponent } from './auth/components/login/login.component';
import { RegisterComponent } from './auth/components/register/register.component';
import { ManagerHomeComponent } from './manager/components/manager-home/manager-home.component';
import { ManagerMainPageComponent } from './manager/components/manager-home/content/manager-main-page/manager-main-page.component';
import { ManagerQuestionBasesComponent } from './manager/components/manager-home/content/manager-question-bases/manager-question-bases.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'manager',
    component: ManagerHomeComponent,
    children: [
      { path: 'main', component: ManagerMainPageComponent },
      { path: 'question-bases', component: ManagerQuestionBasesComponent },
    ],
  },
  { path: '**', redirectTo: 'login', pathMatch: 'full' },
];
