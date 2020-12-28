import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CompanyNavPage } from './company-nav.page';

describe('CompanyNavPage', () => {
  let component: CompanyNavPage;
  let fixture: ComponentFixture<CompanyNavPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyNavPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CompanyNavPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
