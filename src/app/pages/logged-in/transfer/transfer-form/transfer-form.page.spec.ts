import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TransferFormPage } from './transfer-form.page';

describe('TransferFormPage', () => {
  let component: TransferFormPage;
  let fixture: ComponentFixture<TransferFormPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransferFormPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TransferFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
