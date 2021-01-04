import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IsFacetsSearchComponent } from './is-facets-search.component';
import { IsFacetsSearchModule } from './is-facets-search.module';
import { APP_BASE_HREF } from '@angular/common';
import { AppModule } from 'src/app/app.module';
import { NgAisInstantSearch } from 'angular-instantsearch';


describe('IsFacetsSearchComponent', () => {
  let component: IsFacetsSearchComponent;
  let fixture: ComponentFixture<IsFacetsSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppModule,
        IsFacetsSearchModule
      ],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    // Override component's own provider
    .overrideComponent(IsFacetsSearchComponent, {
      set: {
        providers: [
          { provide: NgAisInstantSearch, useValue: null }
        ]
      }
    })
    .compileComponents().then(_ => {
      fixture = TestBed.createComponent(IsFacetsSearchComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
