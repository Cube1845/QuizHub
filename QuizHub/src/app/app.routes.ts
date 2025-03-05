import { Routes } from '@angular/router';
import { LoginComponent } from './auth/components/login/login.component';
import { RegisterComponent } from './auth/components/register/register.component';
import { ManagerHomeComponent } from './manager/components/manager-home/manager-home.component';
import { ManagerQuestionBasesComponent } from './manager/components/manager-home/content/manager-question-bases/manager-question-bases.component';
import { QuestionBaseEditComponent } from './manager/components/manager-home/content/manager-question-bases/question-base-edit/question-base-edit.component';
import { userMustBeLoggedInGuard } from './auth/guards/user-must-be-logged-in.guard';
import { userMustNotBeLoggedInGuard } from './auth/guards/user-must-not-be-logged-in.guard';
import { TestCreatorComponent } from './manager/components/manager-home/content/test-creator/test-creator.component';
import { TestEditComponent } from './manager/components/manager-home/content/test-creator/test-edit/test-edit.component';
import { ClientBeginTestComponent } from './client/components/client-begin-test/client-begin-test.component';
import { ClientTestSolveComponent } from './client/components/client-test-solve/client-test-solve.component';
import { ClientTestFinishComponent } from './client/components/client-test-finish/client-test-finish.component';
import { TestHistoryComponent } from './manager/components/manager-home/content/test-history/test-history.component';
import { TestLogsComponent } from './manager/components/manager-home/content/test-history/test-logs/test-logs.component';
import { SelectedAnswersDisplayComponent } from './manager/components/manager-home/content/test-history/test-logs/selected-answers-display/selected-answers-display.component';
import { ChangePasswordComponent } from './manager/components/manager-home/content/change-password/change-password.component';

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
      { path: 'change-password', component: ChangePasswordComponent },
      { path: 'question-bases', component: ManagerQuestionBasesComponent },
      { path: 'question-base-edit/:id', component: QuestionBaseEditComponent },
      { path: 'tests', component: TestCreatorComponent },
      { path: 'test-edit/:id', component: TestEditComponent },
      { path: 'test-history', component: TestHistoryComponent },
      { path: 'test-logs/:id', component: TestLogsComponent },
      {
        path: 'selected-answers-display/:id',
        component: SelectedAnswersDisplayComponent,
      },
    ],
    canActivate: [userMustBeLoggedInGuard],
  },
  {
    path: 'start',
    component: ClientBeginTestComponent,
  },
  {
    path: 'test-solve/:id',
    component: ClientTestSolveComponent,
  },
  {
    path: 'test-finish/:id',
    component: ClientTestFinishComponent,
  },
  { path: '**', redirectTo: 'start', pathMatch: 'full' },
];
