import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BawesAisPaginationComponent } from './bawes-ais-pagination.component';

describe('BawesAisPaginationComponent', () => {
  let component: BawesAisPaginationComponent;
  let fixture: ComponentFixture<BawesAisPaginationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BawesAisPaginationComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BawesAisPaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
