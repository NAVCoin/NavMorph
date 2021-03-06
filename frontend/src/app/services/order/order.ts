import { Injectable } from '@angular/core';

import {GenericNodeApiService}  from '../generic-node-api/generic-node-api';

import { orderNodeApiEndPoints } from "../config";

@Injectable()
export class OrderService {

  constructor( private genServ:GenericNodeApiService) { }

  createOrder(originCoin, destCoin, destAddr, transferAmount) {
    return this.getApiRequest( orderNodeApiEndPoints.createOrder, [originCoin, destCoin, destAddr, transferAmount])
  }

  getOrder(orderId, password) {
    return this.getApiRequest( orderNodeApiEndPoints.getOrder, [orderId, password])
  }

  updateOrderStatus(orderId, password, newStatus) {
    return this.getApiRequest( orderNodeApiEndPoints.getOrderStatus, [orderId, password, newStatus])
  }

  abandonOrder(orderId, password) {
    return this.getApiRequest( orderNodeApiEndPoints.abandonOrder, [orderId, password])
  }

  getApiRequest(endpoint, params){
    let paramString = '/'
    if(params){ //if we have undefined this wont affect the request
      params.forEach((param, i) => {
          if( i > 0) {
            paramString += '/' + param
          } else {
            paramString += param
          }
      });
    }
    return this.genServ.getRequest('order/' + endpoint + paramString)
  }
}
