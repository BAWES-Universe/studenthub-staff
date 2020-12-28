import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabsPage } from './tabs.page';
import { TabsPageModule } from './tabs.module';

import { AppModule } from '../../../app.module';
import { CvBuilderService } from 'src/app/services/logged-in/cvbuilder.service';
import { CvBuilderSpyService } from 'src/app/spy-services/cvbuilder-spy.service';
import { TestModule } from 'src/app/test.module';


describe('TabsPage', () => {
  let component: TabsPage;
  let fixture: ComponentFixture<TabsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppModule,
        TestModule,
        TabsPageModule
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    
    // Override component's own provider
    .overrideComponent(TabsPage, {
      set: {
        providers: [
          { provide: CvBuilderService, useClass: CvBuilderSpyService }
        ]
      }
    })
    .compileComponents().then(_ => {
      fixture = TestBed.createComponent(TabsPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
