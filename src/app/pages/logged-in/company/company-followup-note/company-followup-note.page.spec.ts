import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CompanyFollowupNotePage } from './company-followup-note.page';

describe('CompanyFollowupNotePage', () => {
  let component: CompanyFollowupNotePage;
  let fixture: ComponentFixture<CompanyFollowupNotePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyFollowupNotePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CompanyFollowupNotePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
