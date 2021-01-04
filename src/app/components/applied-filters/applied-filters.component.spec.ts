import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppliedFiltersComponent } from './applied-filters.component';
import { AppliedFiltersModule } from './applied-filters.module';
import { APP_BASE_HREF } from '@angular/common';
import { AppModule } from '../../app.module';
import { NgAisInstantSearch } from 'angular-instantsearch';


describe('AppliedFiltersPage', () => {

  let component: AppliedFiltersComponent;
  let fixture: ComponentFixture<AppliedFiltersComponent>;

  /*let config = { 
    indexName: 'krushn_job_public',
    searchClient: algoliasearch(
    )
  };

  let instantSearchInstance = instantsearch(config);*/

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      //declarations: [ AppliedFiltersComponent ],
      imports: [
        AppModule,
        AppliedFiltersModule
      ],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    // Override component's own provider
    .overrideComponent(AppliedFiltersComponent, {
      set: {
        providers: [
          { provide: NgAisInstantSearch, useValue: null }
        ]
      }
    })
    .compileComponents().then( _ => {

      fixture = TestBed.createComponent(AppliedFiltersComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
