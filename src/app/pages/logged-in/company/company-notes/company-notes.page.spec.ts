import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CompanyNotesPage } from './company-notes.page';

describe('CompanyNotesPage', () => {
  let component: CompanyNotesPage;
  let fixture: ComponentFixture<CompanyNotesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyNotesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CompanyNotesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
