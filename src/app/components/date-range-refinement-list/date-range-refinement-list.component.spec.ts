import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DateRangeRefinementListComponent } from './date-range-refinement-list.component';

describe('DateRangeRefinementListComponent', () => {
  let component: DateRangeRefinementListComponent;
  let fixture: ComponentFixture<DateRangeRefinementListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DateRangeRefinementListComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DateRangeRefinementListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
