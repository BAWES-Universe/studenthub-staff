import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UploadFilePage } from './upload-file.page';

describe('UploadFilePage', () => {
  let component: UploadFilePage;
  let fixture: ComponentFixture<UploadFilePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadFilePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UploadFilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
