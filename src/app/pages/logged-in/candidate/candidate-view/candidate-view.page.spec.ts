import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {
  ActionSheetController,
  AlertController,
  IonicModule,
  LoadingController,
  ModalController,
  NavController,
  Platform,
  PopoverController,
  ToastController
} from '@ionic/angular';
import { of, Subject } from 'rxjs';
import { convertToParamMap, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';

import { CandidateViewPage } from './candidate-view.page';
import { StoreService } from 'src/app/providers/logged-in/store.service';
import { CandidateService } from 'src/app/providers/logged-in/candidate.service';
import { TranslateLabelService } from 'src/app/providers/translate-label.service';
import { InvitationService } from 'src/app/providers/logged-in/invitation.service';
import { AwsService } from 'src/app/providers/aws.service';
import { InterviewEvaluationService } from 'src/app/providers/logged-in/interview-evaluation.service';
import { EventService } from 'src/app/providers/event.service';
import { AuthService } from 'src/app/providers/auth.service';
import { NoteService } from 'src/app/providers/logged-in/note.service';
import { CertificateService } from 'src/app/providers/logged-in/certificate.service';
import { AnalyticsService } from 'src/app/providers/analytics.service';
import { PermissionService } from 'src/app/providers/permission.service';

describe('CandidateViewPage', () => {
  let component: CandidateViewPage;
  let fixture: ComponentFixture<CandidateViewPage>;
  let candidateService: {
    detail: jasmine.Spy;
    transfers: jasmine.Spy;
  };
  let toastController: {
    create: jasmine.Spy;
  };

  beforeEach(waitForAsync(() => {
    candidateService = {
      detail: jasmine.createSpy('detail').and.returnValue(of({})),
      transfers: jasmine.createSpy('transfers').and.returnValue(of([])),
    };

    toastController = {
      create: jasmine.createSpy('create').and.resolveTo({
        present: jasmine.createSpy('present')
      })
    };

    TestBed.configureTestingModule({
      declarations: [CandidateViewPage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ id: '1' }) } } },
        { provide: Router, useValue: {} },
        { provide: NavController, useValue: {} },
        { provide: Platform, useValue: { is: () => false } },
        { provide: AlertController, useValue: {} },
        { provide: StoreService, useValue: { list: () => of([]) } },
        { provide: CandidateService, useValue: candidateService },
        { provide: TranslateLabelService, useValue: {} },
        { provide: InvitationService, useValue: {} },
        { provide: AwsService, useValue: { permanentBucketUrl: 'https://bucket/' } },
        { provide: InterviewEvaluationService, useValue: {} },
        { provide: ToastController, useValue: toastController },
        {
          provide: EventService,
          useValue: {
            reloadCandidateHistory$: new Subject(),
            reloadCandiate$: new Subject(),
            noteUpdated$: new Subject()
          }
        },
        {
          provide: AuthService,
          useValue: {
            errorMessage: (message: string) => message,
            story: null,
            theme: 'day',
            staff_id: 1
          }
        },
        { provide: PopoverController, useValue: {} },
        { provide: NoteService, useValue: {} },
        { provide: ModalController, useValue: {} },
        { provide: FormBuilder, useValue: { group: () => ({}) } },
        { provide: ActionSheetController, useValue: {} },
        { provide: LoadingController, useValue: {} },
        { provide: CertificateService, useValue: {} },
        { provide: AnalyticsService, useValue: { page: () => {} } },
        { provide: PermissionService, useValue: { shouldShowFinancialsTab: () => false } },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .overrideComponent(CandidateViewPage, {
        set: {
          template: `
            <div *ngIf="candidateDetailLoadError && !candidate">{{ candidateDetailLoadError }}</div>
            <ng-container *ngIf="candidate && segment == 'personal-details'">
              <ng-container *ngIf="candidate.candidate_civil_photo_front">
                <img *ngIf="!civilFrontImageUnavailable" />
                <p *ngIf="civilFrontImageUnavailable">Civil ID image unavailable - request re-upload</p>
              </ng-container>
              <ng-container *ngIf="candidate.candidate_civil_photo_back">
                <h5>ID Photo Back</h5>
                <img *ngIf="!civilBackImageUnavailable" />
                <p *ngIf="civilBackImageUnavailable">Civil ID image unavailable - request re-upload</p>
              </ng-container>
            </ng-container>
          `
        }
      })
      .compileComponents();

    fixture = TestBed.createComponent(CandidateViewPage);
    component = fixture.componentInstance;

    spyOn(component, 'initNoteForm').and.stub();
    spyOn(component, 'loadInterviews').and.stub();
  }));

  it('should render the back Civil ID section when only the back photo exists', () => {
    component.segment = 'personal-details';
    component.candidate = {
      candidate_civil_photo_front: null,
      candidate_civil_photo_back: 'back.png'
    } as any;

    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('ID Photo Back');
  });

  it('should keep the filename and mark the back Civil ID image as unavailable on image error', () => {
    component.candidate = {
      candidate_civil_photo_back: 'back.png'
    } as any;

    component.onCivilBackError();

    expect(component.candidate.candidate_civil_photo_back).toBe('back.png');
    expect(component.civilBackImageUnavailable).toBeTrue();
  });

  it('should surface a load error when the candidate detail call returns an error payload', async () => {
    candidateService.detail.and.returnValue(of({
      operation: 'error',
      message: 'Load failed'
    }));

    component.candidate_id = 1;

    component.loadCandidateDetail();
    await fixture.whenStable();

    expect(component.candidateDetailLoadError).toBe('Load failed');
    expect(toastController.create).toHaveBeenCalled();
  });
});
