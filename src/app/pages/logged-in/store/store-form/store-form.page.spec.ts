import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StoreFormPage } from './store-form.page';

describe('StoreFormPage', () => {
  let component: StoreFormPage;
  let fixture: ComponentFixture<StoreFormPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreFormPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StoreFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
