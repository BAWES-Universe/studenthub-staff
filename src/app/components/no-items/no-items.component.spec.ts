import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoItemsComponent } from './no-items.component';
import { NoItemsModule } from './no-items.module';
import { APP_BASE_HREF } from '@angular/common';
import { AppModule } from 'src/app/app.module';

describe('NoItemsComponent', () => {
  let component: NoItemsComponent;
  let fixture: ComponentFixture<NoItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule, NoItemsModule],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents().then(_ => {
      fixture = TestBed.createComponent(NoItemsComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

    
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
