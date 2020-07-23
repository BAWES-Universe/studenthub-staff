import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StoreListPage } from './store-list.page';

describe('StoreListPage', () => {
  let component: StoreListPage;
  let fixture: ComponentFixture<StoreListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StoreListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
