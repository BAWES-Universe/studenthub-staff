import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MallFormPage } from './mall-form.page';

describe('MallFormPage', () => {
  let component: MallFormPage;
  let fixture: ComponentFixture<MallFormPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MallFormPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MallFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
