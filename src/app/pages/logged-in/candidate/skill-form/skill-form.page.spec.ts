import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SkillFormPage } from './skill-form.page';

describe('SkillFormPage', () => {
  let component: SkillFormPage;
  let fixture: ComponentFixture<SkillFormPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SkillFormPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SkillFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
