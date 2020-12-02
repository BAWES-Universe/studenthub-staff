import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SuggestPage } from './suggest.page';

describe('SuggestPage', () => {
  let component: SuggestPage;
  let fixture: ComponentFixture<SuggestPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuggestPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SuggestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
