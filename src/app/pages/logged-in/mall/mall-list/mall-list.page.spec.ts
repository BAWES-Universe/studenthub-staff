import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MallListPage } from './mall-list.page';

describe('MallListPage', () => {
  let component: MallListPage;
  let fixture: ComponentFixture<MallListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MallListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MallListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
