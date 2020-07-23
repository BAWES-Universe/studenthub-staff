import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UniversityViewPage } from './university-view.page';

describe('UniversityViewPage', () => {
  let component: UniversityViewPage;
  let fixture: ComponentFixture<UniversityViewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UniversityViewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UniversityViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
