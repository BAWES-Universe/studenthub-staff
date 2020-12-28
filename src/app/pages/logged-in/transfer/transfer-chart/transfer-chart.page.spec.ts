import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TransferChartPage } from './transfer-chart.page';

describe('TransferChartPage', () => {
  let component: TransferChartPage;
  let fixture: ComponentFixture<TransferChartPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransferChartPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TransferChartPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
