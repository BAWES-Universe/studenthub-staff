import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ValocityPage } from './valocity.page';

describe('ValocityPage', () => {
  let component: ValocityPage;
  let fixture: ComponentFixture<ValocityPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValocityPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ValocityPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
