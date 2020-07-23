import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GenerateIdPage } from './generate-id.page';

describe('GenerateIdPage', () => {
  let component: GenerateIdPage;
  let fixture: ComponentFixture<GenerateIdPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenerateIdPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GenerateIdPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
