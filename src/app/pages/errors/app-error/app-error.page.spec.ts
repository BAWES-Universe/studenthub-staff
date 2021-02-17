import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppErrorPage } from './app-error.page';
import { AppErrorPageModule } from './app-error.module';

import { AppModule } from '../../../../app/app.module';
import { TestModule } from 'src/app/test.module';


describe('AppErrorPage', () => {
  let component: AppErrorPage;
  let fixture: ComponentFixture<AppErrorPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppModule,
        TestModule,
        AppErrorPageModule
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents().then(_ => {
      fixture = TestBed.createComponent(AppErrorPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));
    
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
