import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IsSearchBoxComponent } from './is-search-box.component';
import { IsSearchBoxModule } from './is-search-box.module';
import { APP_BASE_HREF } from '@angular/common';
import { AppModule } from 'src/app/app.module';
import { InstantSearchComponent } from '../instant-search/instant-search.component';

describe('IsSearchBoxComponent', () => {
  let component: IsSearchBoxComponent;
  let fixture: ComponentFixture<IsSearchBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppModule,
        IsSearchBoxModule
      ],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    // Override component's own provider
    .overrideComponent(IsSearchBoxComponent, {
      set: {
        providers: [
          { provide: InstantSearchComponent, useValue: null }
        ]
      }
    })
    .compileComponents().then(_ => {
      fixture = TestBed.createComponent(IsSearchBoxComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
