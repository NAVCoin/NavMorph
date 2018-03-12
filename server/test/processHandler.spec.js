'use strict'

const expect = require('expect')
const rewire = require('rewire')
const sinon = require('sinon')

let ProcessHandler = rewire('../src/lib/processHandler')
let mockLogger = { writeErrorLog: sinon.spy() }

describe('[ProcessHandler]', () => {
  describe('(setup)', () => {
    beforeEach(() => {
      // reset the rewired functions
      ProcessHandler = rewire('../src/lib/processHandler')

      mockLogger = { writeErrorLog: sinon.spy() }
      ProcessHandler.__set__('logger', mockLogger)
    })

    it('should testRpc then startTimer', done => {
      ProcessHandler.testRpc = () => {
        return Promise.resolve()
      }
      const mockTimer = () => {}
      ProcessHandler.startTimer = mockTimer

      const timerSpy = sinon.spy(ProcessHandler, 'startTimer')
      const testRpcSpy = sinon.spy(ProcessHandler, 'testRpc')

      ProcessHandler.setup().then(() => {
        sinon.assert.called(timerSpy)
        sinon.assert.called(testRpcSpy)
        done()
      })
    })

    it('should catch errors from testRpc, clearInterval, then writeErrorLog', done => {
      const orig = global.clearInterval
      global.clearInterval = sinon.spy()
      ProcessHandler.testRpc = () => {
        throw new Error()
      }
      ProcessHandler.setup().then(data => {
        expect(data).toBe(false)
        sinon.assert.calledOnce(global.clearInterval)
        sinon.assert.calledOnce(mockLogger.writeErrorLog)
        done()
      })
    })
  })

  // describe('(testRpc)', () => {})

  describe('(startTimer)', () => {
    beforeEach(() => {
      // reset the rewired functions
      ProcessHandler = rewire('../src/lib/processHandler')
    })
    it('should run setInterval with specific args', done => {
      this.clock = sinon.useFakeTimers()
      const intervalSpy = sinon.spy(global, 'setInterval')
      ProcessHandler.runTasks = () => {}
      const handlerSpy = sinon.spy(ProcessHandler, 'runTasks')

      ProcessHandler.startTimer()
      this.clock.tick(120000 + 1) // Same as server settings timerLength + 1
      sinon.assert.called(intervalSpy)
      sinon.assert.called(handlerSpy)
      this.clock.restore()
      done()
    })
  })
})
