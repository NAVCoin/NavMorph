import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterializeModule } from 'angular2-materialize';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { SendPage } from './send.component';

import { SendCoinsFormComponent } from '../../components/send-coins-form/send-coins-form.component';
import { StatusComponent } from '../../components/status/status.component';

import { GenericNodeApiService } from './../../services/generic-node-api/generic-node-api';
import { SendPageDataService } from '../../services/send-page-data/send-page-data';
import { ChangellyApiService } from '../../services/changelly-api/changelly-api';
import { OrderService } from '../../services/order/order';

import { MockChangellyService } from '../../mock-classes';



describe('SendPage', () => {
  let component: SendPage;
  let fixture: ComponentFixture<SendPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:[
        MaterializeModule,
        HttpModule,
        FormsModule,
        RouterTestingModule
      ],
      declarations: [
        SendPage,
        SendCoinsFormComponent,
        StatusComponent,
      ],
      providers: [
        GenericNodeApiService,
        SendPageDataService,
        ChangellyApiService,
        OrderService
      ]
    })

    .overrideComponent(SendCoinsFormComponent, {
    set: {
      providers: [
        { provide: ChangellyApiService, useClass: MockChangellyService },
      ]
    }})

    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
