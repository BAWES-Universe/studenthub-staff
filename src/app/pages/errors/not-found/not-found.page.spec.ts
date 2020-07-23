import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotFoundPage } from './not-found.page';
import { NotFoundPageModule } from './not-found.module';

import { AppModule } from '../../../../app/app.module';


describe('NotFoundPage', () => {
  let component: NotFoundPage;
  let fixture: ComponentFixture<NotFoundPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppModule,
        NotFoundPageModule
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents().then(_ => {
      fixture = TestBed.createComponent(NotFoundPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));
    
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
