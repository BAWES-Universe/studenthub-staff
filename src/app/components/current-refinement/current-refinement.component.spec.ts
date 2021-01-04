import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentRefinementComponent } from './current-refinement.component';
import { CurrentRefinementModule } from './current-refinement.module';
import { APP_BASE_HREF } from '@angular/common';
import { AppModule } from 'src/app/app.module';
import { NgAisInstantSearch } from 'angular-instantsearch';


describe('CurrentRefinementComponent', () => {
  let component: CurrentRefinementComponent;
  let fixture: ComponentFixture<CurrentRefinementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppModule,
        CurrentRefinementModule
      ],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    // Override component's own provider
    .overrideComponent(CurrentRefinementComponent, {
      set: {
        providers: [
          { provide: NgAisInstantSearch, useValue: null }
        ]
      }
    })
    .compileComponents().then(_ => {
      fixture = TestBed.createComponent(CurrentRefinementComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
