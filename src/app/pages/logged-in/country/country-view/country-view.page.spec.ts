import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CountryViewPage } from './country-view.page';

describe('CountryViewPage', () => {
  let component: CountryViewPage;
  let fixture: ComponentFixture<CountryViewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CountryViewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CountryViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
