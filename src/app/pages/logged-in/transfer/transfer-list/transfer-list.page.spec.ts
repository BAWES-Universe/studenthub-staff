import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TransferListPage } from './transfer-list.page';

describe('TransferListPage', () => {
  let component: TransferListPage;
  let fixture: ComponentFixture<TransferListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransferListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TransferListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
