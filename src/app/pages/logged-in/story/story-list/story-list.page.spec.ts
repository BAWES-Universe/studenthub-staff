import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StoryListPage } from './story-list.page';

describe('StoryListPage', () => {
  let component: StoryListPage;
  let fixture: ComponentFixture<StoryListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoryListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StoryListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
