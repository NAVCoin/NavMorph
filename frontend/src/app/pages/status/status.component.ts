import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService } from '../../services/order/order'
import { QRCodeModule } from 'angular2-qrcode';
import { GenericFunctionsService } from '../../services/generic-functions/generic-functions'


@Component({
  selector: 'status-page',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss'],

  providers: [
    OrderService,
    GenericFunctionsService,
  ],
})
export class StatusPage implements OnInit {

  isLoading: boolean = true
  orderId: string
  orderPass: string
  orderData: object

  orderSuccess: boolean
  orderFail: boolean
  ipBlocked: boolean
  beginAbandonOrder: boolean

  orderAmount: string
  changellyAddress: string
  changellyOrderNumber: string
  orderStatus: string
  estFee: string
  sourceCurrency: string
  destCurrency: string
  abandonStatus: string
  isCopied: boolean

  waitTimeLow: string
  waitTimeHigh: string

  constructor(
    private OrderService: OrderService,
    private GenericFuncs: GenericFunctionsService,
    private router: Router,
   ) {}

  ngOnInit() {
    this.parseUrl(this.router.url)
    this.getOrderData()
  }

  parseUrl (url: string){
    const split = url.split('/')
    this.orderId = split[2]
    this.orderPass = split[3]
  }

  getOrderData() {
    this.OrderService.getOrder(this.orderId, this.orderPass)
    .subscribe(data => {
      if (data[0]) {
        if (data[0] === 'BLOCKED') {
          this.ipBlocked = true
        } else {
          this.orderData = data[0]
          this.orderSuccess = true
          this.fillData(data)
        }
      } else {
        this.orderFail = true
      }
      this.isLoading = false
    })
  }

  fillData(data) {
    const mainData = data[0]
    const minMax = data[1]
    this.orderAmount = mainData.order_amount
    this.changellyAddress = mainData.changelly_address_one
    this.orderStatus = mainData.order_status
    this.changellyOrderNumber = mainData.changelly_id
    this.estFee = "10 NAV"
    this.sourceCurrency = mainData.input_currency
    this.destCurrency = mainData.output_currency
    this.waitTimeLow = '' + minMax[0] + ' mins'
    this.waitTimeHigh = '' + minMax[1] + ' mins'
  }

  abandonOrder() {
    this.beginAbandonOrder = true
    this.orderSuccess = false
    this.abandonStatus = 'Pending'

    this.OrderService.abandonOrder(this.orderId, this.orderPass)
    .subscribe(data => {
      console.log(data)
      if (data.status === 'SUCCESS') {
        this.abandonStatus = 'Order sucessfully abandoned. Redirecting to Home Page in 3 seconds'
        setTimeout(()=>{ this.router.navigateByUrl('/') } , 3000)
      } else {
        this.abandonStatus = 'Failed to Abandon Order'
      }
    })
  }

  interpretStatus(status: string): string {
    switch (status) {
      case 'COMPLETED':
        return 'Completed'
      case 'ABANDONED':
        return 'Abandoned'
      case 'EXPIRED':
         return 'Expired'
      case 'CREATED':
        return 'Created'
      case 'CONFIRMING':
       return 'Received'
      case 'EXCHANGING':
      case 'SENDING':
        return 'Exchanging'
      case 'FINISHED':
        return 'Sent'
      case 'FAILED':
      case 'REFUNDED':
      default:
        return 'Error'
    }
  }
}
