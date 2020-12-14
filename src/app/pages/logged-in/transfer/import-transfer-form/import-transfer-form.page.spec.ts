import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ImportTransferFormPage } from './import-transfer-form.page';

describe('ImportTransferFormPage', () => {
  let component: ImportTransferFormPage;
  let fixture: ComponentFixture<ImportTransferFormPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportTransferFormPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ImportTransferFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
