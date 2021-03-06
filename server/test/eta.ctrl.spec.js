'use strict'

const expect = require('expect')
const rewire = require('rewire')
const sinon = require('sinon')

let EtaCtrl = rewire('../server/lib/order/eta.ctrl')
let Validator = rewire('../server/lib/options-validator') // eslint-disable-line

describe('[EtaCtrl]', () => {
  describe('(generateEstimate)', () => {
    beforeEach(() => { // reset the rewired functions
      EtaCtrl = rewire('../server/lib/order/eta.ctrl')
      Validator = rewire('../server/lib/options-validator')
    })
    it('should catch rejected params', (done) => {
      const req = {
        params: {
          generateEstimateOptions: {},
        },
      }

      const mockApiOptions = { junkOption: {} }
      EtaCtrl.__set__('ApiOptions', mockApiOptions)

      const err = 'TEST_ERROR'
      const junkRes = { junk: 'response' }

      const mockStartValidation = (param, options) => {
        expect(param).toBe(req.params)
        expect(options).toBe(mockApiOptions.generateEstimateOptions)
        return Promise.reject(err)
      }

      EtaCtrl.__set__('Validator.startValidation', mockStartValidation)
      const mockErrorHandler = {
        handleError: (params) => {
          expect(params.err).toBe(err)
          expect(params.res).toBe(junkRes)
          expect(params.code).toBeA('string')
          done()
        }
      }
      EtaCtrl.__set__('ErrorHandler', mockErrorHandler)
      EtaCtrl.generateEstimate(req, junkRes)
    })

    it('should pass on params', (done) => {
      const req = {
        params: {
          generateEstimateOptions: {},
          from: 'NAV',
          to: 'BTC',
        },
      }

      const mockApiOptions = { junkOption: {} }
      EtaCtrl.__set__('ApiOptions', mockApiOptions)

      const mockStartValidation = (param, options) => {
        expect(param).toBe(req.params)
        expect(options).toBe(mockApiOptions.generateEstimateOptions)
        return Promise.resolve()
      }
      EtaCtrl.__set__('Validator.startValidation', mockStartValidation)

      const mockEta = [1, 1]

      EtaCtrl.getEta = (options) => {
        expect(options.status).toBe('ESTIMATE')
        expect(options.timeSent).toBeA('object')
        expect(options.to).toBe(req.params.to)
        expect(options.from).toBe(req.params.from)
        return Promise.resolve(mockEta)
      }

      const junkRes = {
        send: (data) => {
          expect(data).toBe(mockEta)
          done()
        },
      }

      EtaCtrl.generateEstimate(req, junkRes)
    })

    it('should catch rejection from getEta on params', (done) => {
      const req = {
        params: {
          generateEstimateOptions: {},
          from: 'NAV',
          to: 'BTC',
        },
      }

      const mockApiOptions = { junkOption: {} }
      EtaCtrl.__set__('ApiOptions', mockApiOptions)

      const mockStartValidation = () => {
        return Promise.resolve()
      }
      EtaCtrl.__set__('Validator.startValidation', mockStartValidation)
      const mockError = 'ERROR'
      EtaCtrl.getEta = () => {
        return Promise.reject(mockError)
      }

      const mockErrorHandler = {
        handleError: (params) => {
          expect(params.err).toBe(mockError)
          done()
        }
      }
      EtaCtrl.__set__('ErrorHandler', mockErrorHandler)

      EtaCtrl.generateEstimate(req, null)
    })
  })

  describe('(getEta)', () => {
    beforeEach(() => { // reset the rewired functions
      EtaCtrl = rewire('../server/lib/order/eta.ctrl')
      Validator = rewire('../server/lib/options-validator')
    })
    afterEach(() => { // reset the rewired functions
      EtaCtrl = rewire('../server/lib/order/eta.ctrl')
      Validator = rewire('../server/lib/options-validator')
    })
    it('should catch rejected params', (done) => {
      const testParams = {}

      const mockApiOptions = { junkOption: {} }
      EtaCtrl.__set__('ApiOptions', mockApiOptions)

      const mockErr = 'BAD_PARAMS'

      const mockStartValidation = (params, options) => {
        expect(params).toBe(testParams)
        expect(options).toBe(mockApiOptions.generateEstimateOptions)
        return Promise.reject(mockErr)
      }
      EtaCtrl.__set__('Validator.startValidation', mockStartValidation)

      EtaCtrl.getEta(testParams)
      .catch((error) => {
        expect(error.error).toBe(mockErr)
        done()
      })
    })

    it('should catch an invalid status', (done) => {
      const testParams = {}

      const mockApiOptions = { junkOption: {} }
      EtaCtrl.__set__('ApiOptions', mockApiOptions)

      const mockStartValidation = () => {
        return Promise.resolve()
      }
      EtaCtrl.__set__('Validator.startValidation', mockStartValidation)

      EtaCtrl.validStatus = () => {
        return false
      }

      EtaCtrl.getEta(testParams)
      .catch((error) => {
        expect(error.message).toBe('INVALID_ORDER_STATUS')
        done()
      })
    })

    it('should catch an invalid timeSent', (done) => {
      const testParams = {
        timeSent: '5 hours ago',
        status: 'FINISHED',
      }

      const mockApiOptions = { junkOption: {} }
      EtaCtrl.__set__('ApiOptions', mockApiOptions)

      const mockStartValidation = () => {
        return Promise.resolve()
      }
      EtaCtrl.__set__('Validator.startValidation', mockStartValidation)

      EtaCtrl.validStatus = () => {
        return true
      }

      EtaCtrl.getEta(testParams)
      .catch((error) => {
        expect(error.message).toBe('INVALID_SENT_TIME')
        done()
      })
    })

    it('should pass on params', (done) => {
      const testParams = {
        timeSent: new Date(),
        status: 'CREATED',
      }

      const mockApiOptions = { junkOption: {} }
      EtaCtrl.__set__('ApiOptions', mockApiOptions)

      const mockStartValidation = () => {
        return Promise.resolve()
      }
      EtaCtrl.__set__('Validator.startValidation', mockStartValidation)

      EtaCtrl.validStatus = () => {
        return true
      }

      EtaCtrl.buildEta = (params) => {
        expect(params).toBe(testParams)
        done()
      }
      EtaCtrl.getEta(testParams)
    })
  })

  describe('(validStatus)', () => {
    beforeEach(() => { // reset the rewired functions
      EtaCtrl = rewire('../server/lib/order/eta.ctrl')
    })
    it('should fail incorrect statuses', () => {
      const status = 'INCORRECT'
      const mockValidStatuses = ['CORRECT']
      EtaCtrl.__set__('validStatuses', mockValidStatuses)


      expect(EtaCtrl.validStatus(status)).toBe(false)
    })

    it('should pass correct statuses', () => {
      const status = 'CORRECT'
      const mockValidStatuses = ['CORRECT']
      EtaCtrl.__set__('validStatuses', mockValidStatuses)


      expect(EtaCtrl.validStatus(status)).toBe(true)
    })
  })

  describe('(buildEta)', () => {
    beforeEach(() => { // reset the rewired functions
      EtaCtrl = rewire('../server/lib/order/eta.ctrl')
    })
    it('should skip on certain expected statuses', () => {
      const statuses = ['COMPLETED', 'ABANDONED', 'FAILED', 'REFUNDED', 'EXPIRED',
        'GARBAGE_STATUS']
      for (const status of statuses) {
        const result = EtaCtrl.buildEta({ status })
        expect(result).toEqual([0, 0])
      }
    })

    it('should process statuses with or without NAV correctly', () => {
      let statuses = ['CREATED', 'ESTIMATE']
      const mockTimes = {
        changelly: [1, 2],
        navTech: [1, 2],
      }
      EtaCtrl.__set__('timeConsts', mockTimes)

      for (const status of statuses) {
        const result = EtaCtrl.buildEta({ status })
        expect(result).toEqual([3, 6])
      }
      for (const status of statuses) {
        const result = EtaCtrl.buildEta({ status, originCoin: 'NAV' })
        expect(result).toEqual([2, 4])
      }
      for (const status of statuses) {
        const result = EtaCtrl.buildEta({ status, destCoin: 'NAV' })
        expect(result).toEqual([2, 4])
      }

      statuses = ['CONFIRMING']
      for (const status of statuses) {
        const result = EtaCtrl.buildEta({ status })
        expect(result).toEqual([2, 4])
      }
      for (const status of statuses) {
        const result = EtaCtrl.buildEta({ status, destCoin: 'NAV' })
        expect(result).toEqual([1, 2])
      }

      statuses = ['EXCHANGING', 'SENDING']
      for (const status of statuses) {
        const result = EtaCtrl.buildEta({ status })
        expect(result).toEqual([2, 4])
      }
      for (const status of statuses) {
        const result = EtaCtrl.buildEta({ status, destCoin: 'NAV' })
        expect(result).toEqual([1, 2])
      }
    })

    it('should deal with the FINISHED status correctly', () => {
      const mockTimes = {
        changelly: [1, 2],
        navTech: [1, 2],
      }

      const timeSent = new Date()
      const status = 'FINISHED'

      EtaCtrl.__set__('timeConsts', mockTimes)

      const mockFactorTime = (min, max, time) => {
        expect(min).toExist()
        expect(max).toExist()
        expect(time).toExist()
        return [min - 1, max - 1]
      }
      EtaCtrl.factorTimeSinceSending = mockFactorTime
      let result = EtaCtrl.buildEta({ status, timeSent })
      expect(result).toEqual([1, 3])

      result = EtaCtrl.buildEta({ status, timeSent, destCoin: 'NAV' })
      expect(result).toEqual([0, 1])
    })
  })

  describe('(factorTimeSinceSending)', () => {
    beforeEach(() => { // reset the rewired functions
      EtaCtrl = rewire('../server/lib/order/eta.ctrl')
    })
    it('should factor in the time since sending', () => {
      // freeze date/time
      let clock = sinon.useFakeTimers() //eslint-disable-line
      const testTime = new Date()
      clock.tick('01:00') // tick one minute

      expect(EtaCtrl.factorTimeSinceSending(10, 10, testTime)).toEqual([9, 9])
      clock.restore() // restore date and time funcs
    })
  })
})
