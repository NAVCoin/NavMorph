import { TestBed, inject } from '@angular/core/testing';

import { SendPageDataService } from './send-page-data';

describe('SendPageDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SendPageDataService]
    });
    this.testData = {
      'transferAmount': 50,
      'originCoin': 'BTC',
      'destCoin': 'DOGE',
      'destAddr': 'DE5khkYzkxJpH48LG1YbQcM1UPcHye4NC1'
    }
  });

  it('should be created', inject([SendPageDataService], (service: SendPageDataService) => {
    expect(service).toBeTruthy();
  }));

  it('should be able to clear it\'s data', inject([SendPageDataService], (service: SendPageDataService) => {
    console.log(this.testData)
    service.transferAmount = this.testData.transferAmount
    service.originCoin = this.testData.originCoin
    service.destCoin = this.testData.destCoin
    service.destAddr = this.testData.destAddr

    service.clearData()

    expect(service.transferAmount).toBeUndefined();
    expect(service.originCoin).toBeUndefined();
    expect(service.destCoin).toBeUndefined();
    expect(service.destAddr).toBeUndefined();
  }));

  it('should be store data', inject([SendPageDataService], (service: SendPageDataService) => {

    service.storeData(this.testData.transferAmount, this.testData.originCoin,
      this.testData.destCoin, this.testData.destAddr)

    expect(service.transferAmount).toBe(this.testData.transferAmount);
    expect(service.originCoin).toBe(this.testData.originCoin);
    expect(service.destCoin).toBe(this.testData.destCoin);
    expect(service.destAddr).toBe(this.testData.destAddr);
  }));

  it('should be return data', inject([SendPageDataService], (service: SendPageDataService) => {
    service.transferAmount = this.testData.transferAmount
    service.originCoin = this.testData.originCoin
    service.destCoin = this.testData.destCoin
    service.destAddr = this.testData.destAddr

    const returnedData = service.getData()

    expect(returnedData).toEqual(this.testData);
  }));
});