import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TransferViewPage } from './transfer-view.page';

describe('TransferViewPage', () => {
  let component: TransferViewPage;
  let fixture: ComponentFixture<TransferViewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransferViewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TransferViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
