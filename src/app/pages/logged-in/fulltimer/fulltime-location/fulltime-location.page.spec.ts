import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FulltimeLocationPage } from './fulltime-location.page';

describe('FulltimeLocationPage', () => {
  let component: FulltimeLocationPage;
  let fixture: ComponentFixture<FulltimeLocationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FulltimeLocationPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FulltimeLocationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
