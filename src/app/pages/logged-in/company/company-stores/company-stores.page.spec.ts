import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CompanyStoresPage } from './company-stores.page';

describe('CompanyStoresPage', () => {
  let component: CompanyStoresPage;
  let fixture: ComponentFixture<CompanyStoresPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyStoresPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CompanyStoresPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
