import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExpiredIdPage } from './expired-id.page';

describe('ExpiredIdPage', () => {
  let component: ExpiredIdPage;
  let fixture: ComponentFixture<ExpiredIdPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpiredIdPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ExpiredIdPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
