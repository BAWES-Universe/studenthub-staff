import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CountryListPage } from './country-list.page';

describe('CountryListPage', () => {
  let component: CountryListPage;
  let fixture: ComponentFixture<CountryListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CountryListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CountryListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
