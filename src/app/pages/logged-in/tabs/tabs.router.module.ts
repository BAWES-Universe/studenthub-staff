import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
// services
import { AuthService } from '../../../providers/auth.service';
import {StoryGuard} from '../../../providers/guards/story-guard.service';


const routes: Routes = [
  {
    path: 'view',
    component: TabsPage,
    canActivate: [AuthService],
    children: [
      {
        path: 'tasks',
        loadChildren: () => import('../default/default.module').then(m => m.DefaultPageModule),
        data: {
          name: 'DefaultPage'
        }
      },
      {
        path: 'candidate-search',
        loadChildren: () => import('../candidate/candidate-search/candidate-search.module').then(m => m.CandidateSearchPageModule),
        data: {
          name: 'CandidateSearchPage',
          navDisable: true,
        }
      },
      {
        path: 'email-campaign-list',
        loadChildren: () => import('../email-campaign/email-campaign-list/email-campaign-list.module').then( m => m.EmailCampaignListPageModule),
        data: {
          name: 'EmailCampaignPage',
          navDisable: true,
        }
      },
      {
        path: 'fulltimer-search',
        loadChildren: () => import('../fulltimer/fulltimer-search/fulltimer-search.module').then( m => m.FulltimerSearchPageModule),
        data: {
          name: 'FulltimerSearchPage',
          navDisable: true
        }
      },
      {
        path: 'company-list',
        loadChildren: () => import('../company/company-list/company-list.module').then(m => m.CompanyListPageModule),
        data: {
          name: 'CompanyListPage',
        }
      },
      {
        path: 'company-request-dashboard',
        loadChildren: () => import('../company/company-request-dashboard/company-request-dashboard.module').then( m => m.CompanyRequestDashboardPageModule)
      },
      {
        path: 'report-list',
        loadChildren: () => import('../report-list/report-list.module').then( m => m.ReportListPageModule),
        canActivate: [AuthService],
        data: {
          name: 'ReportPageList'
        }
      },
      {
        path: 'feedback-backlog',
        loadChildren: () => import('../feedback-backlog/feedback-backlog.module').then( m => m.FeedbackBacklogPageModule),
        canActivate: [AuthService],
        data: {
          name: 'FeedbackBacklogPage'
        }
      },
      {
        path: 'story-list',
        loadChildren: () => import('../story/story-list/story-list.module').then( m => m.StoryListPageModule),
        canActivate: [AuthService],
        data: {
          name: 'StoryPageList'
        }
      },
      {
        path: 'my-work',
        loadChildren: () => import('../my-work/my-work.module').then( m => m.MyWorkPageModule),
        data: {
          name: 'MyWorkPage'
        }
      },
      {
        path: '',
        redirectTo: '/view/tasks',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/view/tasks',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class TabsPageRoutingModule { }
