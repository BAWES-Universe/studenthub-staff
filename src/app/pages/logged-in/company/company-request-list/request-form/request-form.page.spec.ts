import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RequestFormPage } from './request-form.page';

describe('RequestFormPage', () => {
  let component: RequestFormPage;
  let fixture: ComponentFixture<RequestFormPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestFormPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RequestFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
