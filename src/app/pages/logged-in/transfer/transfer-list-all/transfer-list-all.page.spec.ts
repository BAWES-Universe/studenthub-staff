import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TransferListAllPage } from './transfer-list-all.page';

describe('TransferListAllPage', () => {
  let component: TransferListAllPage;
  let fixture: ComponentFixture<TransferListAllPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransferListAllPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TransferListAllPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
