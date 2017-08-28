const TransactionCtrl = require('../db/transaction.ctrl')
const EtaCtrl = require('./eta.ctrl')
const configData = require('../../config')
const Logger = require('../logger')

const OrderStatusCtrl = {}

OrderStatusCtrl.getOrder = (req, res) => {
  const polymorphId = req.params.orderId
  const orderPassword = req.params.orderPassword
  TransactionCtrl.internal.getOrder(polymorphId, orderPassword)
  .then((order) => {
    if (order[0].order_status === 'abandoned' || !order[0]) {
      res.send([[],[]])
    } else {
      EtaCtrl.getEta(order[0].order_status, order[0].sent, order.input_currency, order.output_currency)
      .then((eta) => {
        res.send([order, eta])
      })
      .catch(((error) => { OrderStatusCtrl.handleError(error, res, '007') }))
    }
  })
  .catch((error) => { OrderStatusCtrl.handleError(error, res, '001') })
}

OrderStatusCtrl.updateOrderStatus = (req, res) => {
  const polymorphId = req.params.orderId
  const orderPassword = req.params.orderPassword
  const newStatus = req.params.status
  if (configData.validOrderStatuses.indexOf(newStatus) === -1) {
    OrderStatusCtrl.handleError(new Error('Invalid order status'), res, '006')
  }
  TransactionCtrl.internal.updateOrderStatus(polymorphId, orderPassword, newStatus)
  .then((order) => { res.send(order) })
  .catch((error) => { OrderStatusCtrl.handleError(error, res, '004') })
}

OrderStatusCtrl.abandonOrder = (req, res) => {
  const polymorphId = req.params.orderId
  const orderPassword = req.params.orderPassword
  TransactionCtrl.internal.updateOrderStatus(polymorphId, orderPassword, 'abandoned')
  .then(() => { res.send({ status: 'SUCCESS' }) })
  .catch((error) => { OrderStatusCtrl.handleError(error, res, '005') })
}

OrderStatusCtrl.handleError = (error, res, code) => {
  const statusMessage = 'Unable to fetch/update Polymorph Order'
  res.send(JSON.stringify({
    statusCode: 200,
    type: 'FAIL',
    code: 'ORDER_STATUS_CTRL_' + code || '000',
    statusMessage,
    error,
  }))
  Logger.writeLog(code, statusMessage, error, true)
}

module.exports = OrderStatusCtrl
