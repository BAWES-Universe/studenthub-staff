import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefinementListComponent } from './refinement-list.component';
import { RefinementListModule } from './refinement-list.module';
import { APP_BASE_HREF } from '@angular/common';
import { AppModule } from 'src/app/app.module';
import { NgAisInstantSearch } from 'angular-instantsearch';


describe('RefinementListComponent', () => {
  let component: RefinementListComponent;
  let fixture: ComponentFixture<RefinementListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }],
      imports: [
        AppModule,
        RefinementListModule
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    // Override component's own provider
    .overrideComponent(RefinementListComponent, {
      set: {
        providers: [
          { provide: NgAisInstantSearch, useValue: null }
        ]
      }
    })
    .compileComponents().then(_ => {
      fixture = TestBed.createComponent(RefinementListComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  /*it('should create', () => {
    expect(component).toBeTruthy();
  });*/
});
