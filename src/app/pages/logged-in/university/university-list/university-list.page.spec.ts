import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UniversityListPage } from './university-list.page';

describe('UniversityListPage', () => {
  let component: UniversityListPage;
  let fixture: ComponentFixture<UniversityListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UniversityListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UniversityListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
