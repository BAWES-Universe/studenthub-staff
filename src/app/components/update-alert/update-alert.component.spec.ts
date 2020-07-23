import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateAlertComponent } from './update-alert.component';
import { UpdateAlertModule } from './update-alert.module';
import { APP_BASE_HREF } from '@angular/common';
import { AppModule } from 'src/app/app.module';

describe('UpdateAlertComponent', () => {
  let component: UpdateAlertComponent;
  let fixture: ComponentFixture<UpdateAlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({ 
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }],
      imports: [
        AppModule,
        UpdateAlertModule
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents().then(_ => {
      fixture = TestBed.createComponent(UpdateAlertComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

    });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
