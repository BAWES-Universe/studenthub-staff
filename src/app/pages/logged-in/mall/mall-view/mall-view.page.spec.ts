import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MallViewPage } from './mall-view.page';

describe('MallViewPage', () => {
  let component: MallViewPage;
  let fixture: ComponentFixture<MallViewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MallViewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MallViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
