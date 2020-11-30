import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NationalityPage } from './nationality.page';

describe('NationalityPage', () => {
  let component: NationalityPage;
  let fixture: ComponentFixture<NationalityPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NationalityPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NationalityPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
