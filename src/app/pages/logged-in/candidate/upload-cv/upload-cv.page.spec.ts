import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UploadCvPage } from './upload-cv.page';

describe('UploadCvPage', () => {
  let component: UploadCvPage;
  let fixture: ComponentFixture<UploadCvPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadCvPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UploadCvPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
