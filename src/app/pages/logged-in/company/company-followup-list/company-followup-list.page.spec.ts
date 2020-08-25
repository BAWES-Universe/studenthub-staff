import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CompanyFollowupListPage } from './company-followup-list.page';

describe('CompanyFollowupListPage', () => {
  let component: CompanyFollowupListPage;
  let fixture: ComponentFixture<CompanyFollowupListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyFollowupListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CompanyFollowupListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
