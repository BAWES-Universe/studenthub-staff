import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StoreOptionPage } from './store-option.page';

describe('StoreOptionPage', () => {
  let component: StoreOptionPage;
  let fixture: ComponentFixture<StoreOptionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreOptionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StoreOptionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
