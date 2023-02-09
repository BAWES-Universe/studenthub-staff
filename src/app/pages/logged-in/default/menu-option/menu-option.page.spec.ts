import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MenuOptionPage } from './menu-option.page';

describe('MenuOptionPage', () => {
  let component: MenuOptionPage;
  let fixture: ComponentFixture<MenuOptionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuOptionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MenuOptionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
