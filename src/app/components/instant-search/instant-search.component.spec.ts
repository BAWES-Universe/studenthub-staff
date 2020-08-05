import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import algoliasearch from 'instantsearch.js/es';

import { InstantSearchComponent } from './instant-search.component';
import { InstantSearchModule } from './instant-search.module';
import { APP_BASE_HREF } from '@angular/common';
import { AppModule } from 'src/app/app.module';

describe('InstantSearchPage', () => {
  let component: InstantSearchComponent;
  let fixture: ComponentFixture<InstantSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppModule,
        InstantSearchModule
      ],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents().then(_ => {
      fixture = TestBed.createComponent(InstantSearchComponent);

      let config = { 
        indexName: 'krushn_job_public',
        searchClient: algoliasearch(
          1, 1
        )
      };
 
      fixture.componentInstance.config = config;
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));
  
  /*it('should create', () => {
    expect(component).toBeTruthy();
  });*/
});
