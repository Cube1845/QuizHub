import { Routes } from '@angular/router';
import { LoginComponent } from './auth/components/login/login.component';
import { RegisterComponent } from './auth/components/register/register.component';
import { ManagerHomeComponent } from './manager/components/manager-home/manager-home.component';
import { ManagerMainPageComponent } from './manager/components/manager-home/content/manager-main-page/manager-main-page.component';
import { ManagerQuestionBasesComponent } from './manager/components/manager-home/content/manager-question-bases/manager-question-bases.component';
import { QuestionBaseEditComponent } from './manager/components/manager-home/content/manager-question-bases/question-base-edit/question-base-edit.component';
import { userMustBeLoggedInGuard } from './auth/guards/user-must-be-logged-in.guard';
import { userMustNotBeLoggedInGuard } from './auth/guards/user-must-not-be-logged-in.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [userMustNotBeLoggedInGuard],
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [userMustNotBeLoggedInGuard],
  },
  {
    path: 'manager',
    component: ManagerHomeComponent,
    children: [
      { path: 'main', component: ManagerMainPageComponent },
      { path: 'question-bases', component: ManagerQuestionBasesComponent },
      { path: 'question-base-edit/:id', component: QuestionBaseEditComponent },
    ],
    canActivate: [userMustBeLoggedInGuard],
  },
  { path: '**', redirectTo: 'login', pathMatch: 'full' },
];
