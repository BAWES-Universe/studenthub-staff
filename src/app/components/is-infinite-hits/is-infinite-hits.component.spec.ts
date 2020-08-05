import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IsInfiniteHitsComponent } from './is-infinite-hits.component';
import { IsInfiniteHitsModule } from './is-infinite-hits.module';
import { APP_BASE_HREF } from '@angular/common';
import { AppModule } from 'src/app/app.module';
import { InstantSearchComponent } from '../instant-search/instant-search.component';

describe('IsInfiniteHitsComponent', () => {
  let component: IsInfiniteHitsComponent;
  let fixture: ComponentFixture<IsInfiniteHitsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule, IsInfiniteHitsModule],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    // Override component's own provider
    .overrideComponent(IsInfiniteHitsComponent, {
      set: {
        providers: [
          { provide: InstantSearchComponent, useValue: null }
        ]
      }
    })
    .compileComponents().then(_ => {
      fixture = TestBed.createComponent(IsInfiniteHitsComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
