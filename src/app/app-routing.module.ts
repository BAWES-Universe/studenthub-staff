import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthService } from './providers/auth.service';
import { LoginGuard } from './providers/guards/login-guard.service';
import { SelectiveLoadingStrategy } from './util/SelectiveLoadingStrategy';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/logged-in/tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/start-pages/login/login.module').then(m => m.LoginPageModule),
    canActivate: [LoginGuard],
    data: {
      name: 'LoginPage'
    }
  },
  {
    path: 'candidate-form',
    loadChildren: () => import('./pages/logged-in/candidate/candidate-form/candidate-form.module').then(m => m.CandidateFormPageModule),
    canActivate: [AuthService],
    data: {
      navDisable: true,
      name: 'CandidateFormPage'
    }
  },
  {
    path: 'candidate-list',
    loadChildren: () => import('./pages/logged-in/candidate/candidate-list/candidate-list.module').then(m => m.CandidateListPageModule),
    canActivate: [AuthService],
    data: {
      name: 'CandidateListPage'
    }
  },
  {
    path: 'incomplete-candidate-list',
    loadChildren: () => import('./pages/logged-in/candidate/incomplete-candidate-list/incomplete-candidate-list.module').then(m => m.IncompleteCandidateListPageModule),
    canActivate: [AuthService],
    data: {
      name: 'IncompleteCandidateListPage'
    }
  },
  {
    path: 'candidate-bank-info-list',
    loadChildren: () => import('./pages/logged-in/candidate/candidate-bank-info-list/candidate-bank-info-list.module').then(m => m.CandidateBankInfoListModule),
    canActivate: [AuthService],
    data: {
      name: 'CandidateBankInfoList'
    }
  },
  {
    path: 'candidate-view',
    loadChildren: () => import('./pages/logged-in/candidate/candidate-view/candidate-view.module').then(m => m.CandidateViewPageModule),
    canActivate: [AuthService],
    data: {
      name: 'CandidateViewPage',
      navDisable: true,
    }
  },
  {
    path: 'expired-id',
    loadChildren: () => import('./pages/logged-in/candidate/expired-id/expired-id.module').then(m => m.ExpiredIdPageModule),
    canActivate: [AuthService],
    data: {
      name: 'ExpiredIdPage'
    }
  },
  {
    path: 'generate-id',
    loadChildren: () => import('./pages/logged-in/candidate/generate-id/generate-id.module').then(m => m.GenerateIdPageModule),
    canActivate: [AuthService],
    data: {
      name: 'GenerateIdPage'
    }
  },
  {
    path: 'country-list',
    loadChildren: () => import('./pages/logged-in/country/country-list/country-list.module').then(m => m.CountryListPageModule),
    canActivate: [AuthService],
    data: {
      name: 'CountryListPage'
    }
  },
  {
    path: 'country-view',
    loadChildren: () => import('./pages/logged-in/country/country-view/country-view.module').then(m => m.CountryViewPageModule),
    canActivate: [AuthService],
    data: {
      name: 'CountryViewPage',
      navDisable: true,
    }
  },
  {
    path: 'store-form',
    loadChildren: () => import('./pages/logged-in/store/store-form/store-form.module').then(m => m.StoreFormPageModule),
    canActivate: [AuthService],
    data: {
      name: 'StoreFormPage'
    }
  },
  {
    path: 'store-list',
    loadChildren: () => import('./pages/logged-in/store/store-list/store-list.module').then(m => m.StoreListPageModule),
    canActivate: [AuthService],
    data: {
      name: 'StoreListPage'
    }
  },
  {
    path: 'store-view',
    loadChildren: () => import('./pages/logged-in/store/store-view/store-view.module').then(m => m.StoreViewPageModule),
    canActivate: [AuthService],
    data: {
      name: 'StoreViewPage',
      navDisable: true,
    }
  },
  {
    path: 'university-list',
    loadChildren: () => import('./pages/logged-in/university/university-list/university-list.module').then(m => m.UniversityListPageModule),
    canActivate: [AuthService],
    data: {
      name: 'UniversityListPage'
    }
  },
  {
    path: 'university-view',
    loadChildren: () => import('./pages/logged-in/university/university-view/university-view.module').then(m => m.UniversityViewPageModule),
    canActivate: [AuthService],
    data: {
      name: 'UniversityViewPage'
    }
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
    path: 'company-view',
    loadChildren: () => import('./pages/logged-in/company/company-view/company-view.module').then(m => m.CompanyViewPageModule),
    canActivate: [AuthService],
    data: {
      name: 'CompanyViewPage',
      navDisable: true,
    }
  },
  {
    path: 'candidate-review-list',
    loadChildren: () => import('./pages/logged-in/candidate/candidate-review-list/candidate-review-list.module').then(m => m.CandidateReviewListPageModule),
    canActivate: [AuthService],
    data: {
      name: 'CandidateReviewListPage',
    }
  },
  {
    path: 'company-followup-note',
    loadChildren: () => import('./pages/logged-in/company/company-followup-note/company-followup-note.module').then(m => m.CompanyFollowupNotePageModule),
    canActivate: [AuthService],
    data: {
      name: 'CompanyFollowupNotePage',
    }
  },
  {
    path: 'company-request-form',
    loadChildren: () => import('./pages/logged-in/company/company-request-form/company-request-form.module').then(m => m.CompanyRequestFormPageModule),
    canActivate: [AuthService],
    data: {
      name: 'CompanyRequestFormPage',
    }
  },
  {
    path: 'brand-view',
    loadChildren: () => import('./pages/logged-in/company/brand-view/brand-view.module').then(m => m.BrandViewPageModule),
    canActivate: [AuthService],
    data: {
      name: 'BrandViewPage',
    }
  },
  {
    path: 'mall-form',
    loadChildren: () => import('./pages/logged-in/mall/mall-form/mall-form.module').then(m => m.MallFormPageModule),
    canActivate: [AuthService],
    data: {
      name: 'MallFormPage'
    }
  },
  {
    path: 'mall-list',
    loadChildren: () => import('./pages/logged-in/mall/mall-list/mall-list.module').then(m => m.MallListPageModule),
    canActivate: [AuthService],
    data: {
      name: 'MallListPage'
    }
  },
  {
    path: 'mall-view',
    loadChildren: () => import('./pages/logged-in/mall/mall-view/mall-view.module').then(m => m.MallViewPageModule),
    canActivate: [AuthService],
    data: {
      name: 'MallViewPage'
    }
  },
  {
    path: 'store-manager-form',
    loadChildren: () => import('./pages/logged-in/store/store-manager-form/store-manager-form.module').then( m => m.StoreManagerFormPageModule)
  },
  {
    path: 'company-request-list',
    loadChildren: () => import('./pages/logged-in/company/company-request-list/company-request-list.module').then(m => m.CompanyRequestListPageModule),
    canActivate: [AuthService],
    data: {
      name: 'CompanyRequestListPage',
    }
  },
  {
    path: 'request-form',
    loadChildren: () => import('./pages/logged-in/company/company-request-list/request-form/request-form.module').then(m => m.RequestFormPageModule),
    canActivate: [AuthService],
    data: {
      name: 'RequestFormPage',
    }
  },
  {
    path: 'request-view',
    loadChildren: () => import('./pages/logged-in/company/company-request-view/company-request-view.module').then(m => m.CompanyRequestViewPageModule),
    canActivate: [AuthService],
    data: {
      name: 'CompanyRequestViewPage',
    }
  },
  {
    path: 'assigned-expired-civil',
    loadChildren: () => import('./pages/logged-in/candidate/assigned-expired-civil/assigned-expired-civil.module').then( m => m.AssignedExpiredCivilPageModule),
    canActivate: [AuthService],
    data: {
      name: 'AssignedExpiredCivilPage',
    }
  },
  {
    path: 'assigned-idle-candidates',
    loadChildren: () => import('./pages/logged-in/candidate/assigned-idle-candidates/assigned-idle-candidates.module').then( m => m.AssignedIdleCandidatesPageModule),
    canActivate: [AuthService],
    data: {
      name: 'AssignedIdleCandidatesPage',
    }
  },
  {
    path: 'candidate-committed-form',
    loadChildren: () => import('./pages/logged-in/candidate/candidate-committed-form/candidate-committed-form.module').then( m => m.CandidateCommittedFormPageModule)
  },
  {
    path: 'team-list',
    loadChildren: () => import('./pages/logged-in/team/team-list/team-list.module').then( m => m.TeamListPageModule),
    canActivate: [AuthService],
    data: {
      name: 'TeamListPage'
    }
  },
  {
    path: 'team-view',
    loadChildren: () => import('./pages/logged-in/team/team-view/team-view.module').then( m => m.TeamViewPageModule),
    canActivate: [AuthService],
    data: {
      name: 'TeamViewPage'
    }
  },

  {
    path: 'fulltimer',
    loadChildren: () => import('./pages/logged-in/fulltimer/fulltimer-view/fulltimer-view.module').then( m => m.FulltimerViewPageModule),
    canActivate: [AuthService],
    data: {
      name: 'FulltimerViewPage',
      navDisable: true
    }
  },

  {
    path: 'candidate-search',
    loadChildren: () => import('./pages/logged-in/candidate/candidate-search/candidate-search.module').then(m => m.CandidateSearchPageModule),
    data: {
      name: 'CandidateSearchPage',
      navDisable: true,
    }
  },

  {
    path: 'fulltimer-search',
    loadChildren: () => import('./pages/logged-in/fulltimer/fulltimer-search/fulltimer-search.module').then( m => m.FulltimerSearchPageModule),
    data: {
      name: 'FulltimerSearchPage',
      navDisable: true
    }
  },

  {
    path: 'company-followup-list',
    loadChildren: () => import('./pages/logged-in/company/company-followup-list/company-followup-list.module').then(m => m.CompanyFollowupListPageModule),
    data: {
      name: 'CompanyFollowupListPage',
    }
  },

  {
    path: 'company-contact-view',
    loadChildren: () => import('./pages/logged-in/company/company-contact/company-contact-view/company-contact-view.module').then( m => m.CompanyContactViewPageModule),
    canActivate: [AuthService],
    data: {
      name: 'CompanyContactViewPage'
    }
  },

  {
    path: 'company-contact-form',
    loadChildren: () => import('./pages/logged-in/company/company-contact-form/company-contact-form.module').then( m => m.CompanyContactFormPageModule),
    canActivate: [AuthService],
    data: {
      name: 'CompanyContactFormPage'
    }
  },

  {
    path: 'note-view',
    loadChildren: () => import('./pages/logged-in/note/note-view/note-view.module').then( m => m.NoteViewPageModule),
    canActivate: [AuthService],
    data: {
      name: 'NoteViewPage'
    }
  },
  {
    path: 'suggestion-view',
    loadChildren: () => import('./pages/logged-in/suggestion/suggestion-view/suggestion-view.module').then( m => m.SuggestionViewPageModule),
    canActivate: [AuthService],
    data: {
      name: 'SuggestionViewPage'
    }
  },
  {
    path: 'transfer-view',
    loadChildren: () => import('./pages/logged-in/transfer/transfer-view/transfer-view.module').then( m => m.TransferViewPageModule),
    canActivate: [AuthService],
    data: {
      name: 'TransferViewPage'
    }
  },
  {
    path: 'candidate-notes',
    loadChildren: () => import('./pages/logged-in/candidate/candidate-notes/candidate-notes.module').then( m => m.CandidateNotesPageModule),
    canActivate: [AuthService],
    data: {
      name: 'CandidateNotesPage'
    }
  },
  {
    path: 'candidate-suggestions',
    loadChildren: () => import('./pages/logged-in/candidate/candidate-suggestions/candidate-suggestions.module').then( m => m.CandidateSuggestionsPageModule),
    canActivate: [AuthService],
    data: {
      name: 'CandidateSuggestionsPage'
    }
  },
  {
    path: 'fulltimer-notes',
    loadChildren: () => import('./pages/logged-in/fulltimer/fulltimer-notes/fulltimer-notes.module').then( m => m.FulltimerNotesPageModule)
  },
  {
    path: 'bank-list',
    loadChildren: () => import('./pages/logged-in/bank/bank-list/bank-list.module').then(m => m.BankListPageModule),
    canActivate: [AuthService],
    data: {
      name: 'BankListPage'
    }
  },
  {
    path: 'candidate-invitations',
    loadChildren: () => import('./pages/logged-in/candidate/candidate-invitations/candidate-invitations.module').then( m => m.CandidateInvitationsPageModule),
    canActivate: [AuthService],
    data: {
      name: 'CandidateInvitationsPage'
    }
  },
  {
    path: 'candidate-update-email',
    loadChildren: () => import('./pages/logged-in/candidate/candidate-update-email/candidate-update-email.module').then(m => m.CandidateUpdateEmailPageModule),
    canActivate: [AuthService],
    data: {
      name: 'CandidateUpdateEmailPage'
    }
  },
  {
    path: 'app-error',
    loadChildren: () => import('./pages/errors/app-error/app-error.module').then( m => m.AppErrorPageModule)
  },
  {
    path: '**',
    redirectTo: 'not-found'
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { enableTracing: false, preloadingStrategy: SelectiveLoadingStrategy })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
