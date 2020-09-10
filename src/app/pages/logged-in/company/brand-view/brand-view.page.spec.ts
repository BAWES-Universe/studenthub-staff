import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BrandViewPage } from './brand-view.page';

describe('BrandViewPage', () => {
  let component: BrandViewPage;
  let fixture: ComponentFixture<BrandViewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrandViewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BrandViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
