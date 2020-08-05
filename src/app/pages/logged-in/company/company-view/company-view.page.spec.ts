import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CompanyViewPage } from './company-view.page';

describe('CompanyViewPage', () => {
  let component: CompanyViewPage;
  let fixture: ComponentFixture<CompanyViewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyViewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CompanyViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
