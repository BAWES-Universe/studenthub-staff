import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ModalPopPage } from './modal-pop.page';

describe('ModalPopPage', () => {
  let component: ModalPopPage;
  let fixture: ComponentFixture<ModalPopPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalPopPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalPopPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
