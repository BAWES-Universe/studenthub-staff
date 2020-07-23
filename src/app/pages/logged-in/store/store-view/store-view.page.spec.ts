import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StoreViewPage } from './store-view.page';

describe('StoreViewPage', () => {
  let component: StoreViewPage;
  let fixture: ComponentFixture<StoreViewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreViewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StoreViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
