import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MallOptionPage } from './mall-option.page';

describe('MallOptionPage', () => {
  let component: MallOptionPage;
  let fixture: ComponentFixture<MallOptionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MallOptionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MallOptionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
