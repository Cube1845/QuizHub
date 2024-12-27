import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthDataService } from '../../common/services/auth-data.service';

export const userMustNotBeLoggedInGuard: CanActivateFn = (route, state) => {
  const authDataService = inject(AuthDataService);
  const router = inject(Router);

  if (!authDataService.isAuthDataSet()) {
    return true;
  }

  router.navigateByUrl('manager');
  return false;
};
