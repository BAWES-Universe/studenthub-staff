import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthService } from './providers/auth.service';
import { LoginGuard } from './providers/guards/login-guard.service';
import { SelectiveLoadingStrategy } from './util/SelectiveLoadingStrategy';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/default',
    pathMatch: 'full'
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
    path: 'change-password',
    loadChildren: () => import('./pages/logged-in/change-password/change-password.module').then(m => m.ChangePasswordPageModule),
    canActivate: [AuthService],
    data: {
      name: 'ChangePasswordPage'
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
      name: 'CountryListPage',
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
    path: 'default',
    loadChildren: () => import('./pages/logged-in/default/default.module').then(m => m.DefaultPageModule),
    canActivate: [AuthService],
    data: {
      name: 'DefaultPage'
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
    path: 'company-list',
    loadChildren: () => import('./pages/logged-in/company/company-list/company-list.module').then(m => m.CompanyListPageModule),
    canActivate: [AuthService],
    data: {
      name: 'CompanyListPage',
    }
  },
  {
    path: 'candidate-search',
    loadChildren: () => import('./pages/logged-in/candidate/candidate-search/candidate-search.module').then(m => m.CandidateSearchPageModule),
    canActivate: [AuthService],
    data: {
      name: 'CandidateSearchPage',
      navDisable: true,
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
    path: 'company-followup-list',
    loadChildren: () => import('./pages/logged-in/company/company-followup-list/company-followup-list.module').then(m => m.CompanyFollowupListPageModule),
    canActivate: [AuthService],
    data: {
      name: 'CompanyFollowupListPage',
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
    path: 'company-requests',
    loadChildren: () => import('./pages/logged-in/company/company-requests/company-requests.module').then(m => m.CompanyRequestsPageModule),
    canActivate: [AuthService],
    data: {
      name: 'CompanyRequestsPage',
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
    path: 'company-request-dashboard',
    loadChildren: () => import('./pages/logged-in/company/company-request-dashboard/company-request-dashboard.module').then( m => m.CompanyRequestDashboardPageModule)
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
    path: 'fulltimer-search',
    loadChildren: () => import('./pages/logged-in/fulltimer/fulltimer-search/fulltimer-search.module').then( m => m.FulltimerSearchPageModule),
    canActivate: [AuthService],
    data: {
      name: 'FulltimerSearchPage',
      navDisable: true
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
    path: 'company-contact-view',
    loadChildren: () => import('./pages/logged-in/company/company-contact/company-contact-view/company-contact-view.module').then( m => m.CompanyContactViewPageModule),
    canActivate: [AuthService],
    data: {
      name: 'CompanyContactViewPage'
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
    path: 'import-transfer-form',
    loadChildren: () => import('./pages/logged-in/transfer/import-transfer-form/import-transfer-form.module').then(m => m.ImportTransferFormPageModule),
    canActivate: [AuthService],
    data: {
      name: 'ImportTransferFormPage'
    }
  },
  {
    path: 'transfer-form',
    loadChildren: () => import('./pages/logged-in/transfer/transfer-form/transfer-form.module').then(m => m.TransferFormPageModule),
    canActivate: [AuthService],
    data: {
      name: 'TransferFormPage'
    }
  },
  {
    path: 'transfer-view',
    loadChildren: () => import('./pages/logged-in/transfer/transfer-view/transfer-view.module').then(m => m.TransferViewPageModule),
    canActivate: [AuthService],
    data: {
      name: 'TransferViewPage'
    }
  },

  {
    path: 'transfer-chart',
    loadChildren: () => import('./pages/logged-in/transfer/transfer-chart/transfer-chart.module').then( m => m.TransferChartPageModule)
  },
  {
    path: 'transfer-list',
    loadChildren: () => import('./pages/logged-in/transfer/transfer-list/transfer-list.module').then( m => m.TransferListPageModule)
  },
  {
    path: 'company-documents',
    loadChildren: () => import('./pages/logged-in/company/company-documents/company-documents.module').then( m => m.CompanyDocumentsPageModule)
  },
  {
    path: 'company-malls',
    loadChildren: () => import('./pages/logged-in/company/company-malls/company-malls.module').then( m => m.CompanyMallsPageModule)
  },
  {
    path: 'company-brands',
    loadChildren: () => import('./pages/logged-in/company/company-brands/company-brands.module').then( m => m.CompanyBrandsPageModule)
  },
  {
    path: 'company-contacts',
    loadChildren: () => import('./pages/logged-in/company/company-contacts/company-contacts.module').then( m => m.CompanyContactsPageModule)
  },
  {
    path: 'company-stores',
    loadChildren: () => import('./pages/logged-in/company/company-stores/company-stores.module').then( m => m.CompanyStoresPageModule)
  },
  {
    path: 'company-subcompanies',
    loadChildren: () => import('./pages/logged-in/company/company-subcompanies/company-subcompanies.module').then( m => m.CompanySubcompaniesPageModule)
  },
  {
    path: 'company-notes',
    loadChildren: () => import('./pages/logged-in/company/company-notes/company-notes.module').then( m => m.CompanyNotesPageModule)
  },
  {
    path: '**',
    redirectTo: 'not-found'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { enableTracing: false, preloadingStrategy: SelectiveLoadingStrategy })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
