import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StoreManagerFormPage } from './store-manager-form.page';

describe('StoreManagerFormPage', () => {
  let component: StoreManagerFormPage;
  let fixture: ComponentFixture<StoreManagerFormPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreManagerFormPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StoreManagerFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
