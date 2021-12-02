import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SuggestionListPage } from './suggestion-list.page';

describe('InvitationListPage', () => {
  let component: SuggestionListPage;
  let fixture: ComponentFixture<SuggestionListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuggestionListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SuggestionListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
