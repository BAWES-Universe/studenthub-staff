import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoInternetPage } from './no-internet.page';
import { NoInternetPageModule } from './no-internet.module';
import { AppModule } from '../../../app.module';


describe('NoInternetPage', () => {
  let component: NoInternetPage;
  let fixture: ComponentFixture<NoInternetPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppModule,
        NoInternetPageModule
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents().then(_ => {

        fixture = TestBed.createComponent(NoInternetPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
