import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerErrorPage } from './server-error.page';
import { ServerErrorPageModule } from './server-error.module';

import { AppModule } from '../../../app.module';


describe('ServerErrorPage', () => {
  let component: ServerErrorPage;
  let fixture: ComponentFixture<ServerErrorPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppModule,
        ServerErrorPageModule
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents().then(() => {
      fixture = TestBed.createComponent(ServerErrorPage);
      component = fixture.componentInstance;
      fixture.detectChanges();    
    });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
