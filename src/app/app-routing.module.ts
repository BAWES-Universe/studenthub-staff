import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {AuthService} from './providers/auth.service';
import {LoginGuard} from './providers/guards/login-guard.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/default',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/start-pages/login/login.module').then( m => m.LoginPageModule),
    canActivate: [LoginGuard]
  },
  {
    path: 'change-password',
    loadChildren: () => import('./pages/logged-in/change-password/change-password.module').then( m => m.ChangePasswordPageModule),
    canActivate: [AuthService]
  },
  {
    path: 'candidate-form',
    loadChildren: () => import('./pages/logged-in/candidate/candidate-form/candidate-form.module').then( m => m.CandidateFormPageModule),
    canActivate: [AuthService],
  },
  {
    path: 'candidate-list',
    loadChildren: () => import('./pages/logged-in/candidate/candidate-list/candidate-list.module').then( m => m.CandidateListPageModule),
    canActivate: [AuthService],
  },
  {
    path: 'incomplete-candidate-list',
    loadChildren: () => import('./pages/logged-in/candidate/incomplete-candidate-list/incomplete-candidate-list.module').then( m => m.IncompleteCandidateListPageModule),
    canActivate: [AuthService],
  },
  {
    path: 'candidate-bank-info-list',
    loadChildren: () => import('./pages/logged-in/candidate/candidate-bank-info-list/candidate-bank-info-list.module').then( m => m.CandidateBankInfoListModule),
    canActivate: [AuthService],
  },
  {
    path: 'candidate-view',
    loadChildren: () => import('./pages/logged-in/candidate/candidate-view/candidate-view.module').then( m => m.CandidateViewPageModule),
    canActivate: [AuthService],
  },
  {
    path: 'expired-id',
    loadChildren: () => import('./pages/logged-in/candidate/expired-id/expired-id.module').then( m => m.ExpiredIdPageModule),
    canActivate: [AuthService],
  },
  {
    path: 'generate-id',
    loadChildren: () => import('./pages/logged-in/candidate/generate-id/generate-id.module').then( m => m.GenerateIdPageModule),
    canActivate: [AuthService],
  },

  {
    path: 'country-list',
    loadChildren: () => import('./pages/logged-in/country/country-list/country-list.module').then( m => m.CountryListPageModule),
    canActivate: [AuthService],
  },
  {
    path: 'country-view',
    loadChildren: () => import('./pages/logged-in/country/country-view/country-view.module').then( m => m.CountryViewPageModule),
    canActivate: [AuthService],
  },
  {
    path: 'store-form',
    loadChildren: () => import('./pages/logged-in/store/store-form/store-form.module').then( m => m.StoreFormPageModule),
    canActivate: [AuthService],
  },
  {
    path: 'store-list',
    loadChildren: () => import('./pages/logged-in/store/store-list/store-list.module').then( m => m.StoreListPageModule),
    canActivate: [AuthService],
  },
  {
    path: 'store-view',
    loadChildren: () => import('./pages/logged-in/store/store-view/store-view.module').then( m => m.StoreViewPageModule),
    canActivate: [AuthService],
  },
  {
    path: 'university-list',
    loadChildren: () => import('./pages/logged-in/university/university-list/university-list.module').then( m => m.UniversityListPageModule),
    canActivate: [AuthService],
  },
  {
    path: 'university-view',
    loadChildren: () => import('./pages/logged-in/university/university-view/university-view.module').then( m => m.UniversityViewPageModule),
    canActivate: [AuthService],
  },
  {
    path: 'default',
    loadChildren: () => import('./pages/logged-in/default/default.module').then( m => m.DefaultPageModule),
    canActivate: [AuthService],
  },
  {
    path: 'no-internet',
    loadChildren: () => import('./pages/errors/no-internet/no-internet.module').then(m => m.NoInternetPageModule),
    data: {
      name: 'NoInternetPage',
    }
  },
  {
    path: 'server-error',
    loadChildren: () => import('./pages/errors/server-error/server-error.module').then(m => m.ServerErrorPageModule),
    data: {
      name: 'ServerErrorPage',
    }
  },
  {
    path: 'not-found',
    loadChildren: () => import('./pages/errors/not-found/not-found.module').then(m => m.NotFoundPageModule),
    data: {
      name: 'NotFoundPage',
    }
  },
  {
    path: 'company-list',
    loadChildren: () => import('./pages/logged-in/company/company-list/company-list.module').then( m => m.CompanyListPageModule),
    canActivate: [AuthService],
  },
  {
    path: 'candidate-search',
    loadChildren: () => import('./pages/logged-in/candidate/candidate-search/candidate-search.module').then( m => m.CandidateSearchPageModule),
    canActivate: [AuthService],
  },
  {
    path: 'candidate-filter',
    loadChildren: () => import('./pages/logged-in/candidate/candidate-filter/candidate-filter.module').then( m => m.CandidateFilterPageModule),
    canActivate: [AuthService],
  },
  {
    path: 'company-view',
    loadChildren: () => import('./pages/logged-in/company/company-view/company-view.module').then( m => m.CompanyViewPageModule),
    canActivate: [AuthService],
  },
  {
    path: 'candidate-review-list',
    loadChildren: () => import('./pages/logged-in/candidate/candidate-review-list/candidate-review-list.module').then( m => m.CandidateReviewListPageModule),
    canActivate: [AuthService],
  },
  {
    path: 'company-followup-list',
    loadChildren: () => import('./pages/logged-in/company/company-followup-list/company-followup-list.module').then( m => m.CompanyFollowupListPageModule)
  },
  {
    path: '**',
    redirectTo: 'not-found'
  },
  {
    path: 'company-followup-note',
    loadChildren: () => import('./pages/logged-in/company/company-followup-note/company-followup-note.module').then( m => m.CompanyFollowupNotePageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { enableTracing: false, preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
