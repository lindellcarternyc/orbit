import StateMachine from './fsm'

describe('fsm', () => {
  describe('#create', () => {
    it('returns an fsm', () => {
      const fsm = StateMachine.create({
        events: []
      })
      expect(fsm).toBeDefined()
    })

    it('defaults to no state', () => {
      const fsm = StateMachine.create({
        events: []
      })
      expect(fsm.currentState).toBe('NO STATE')
    })

    it('uses initial state when provided', () => {
      const fsm = StateMachine.create({
        initalState: 'RED',
        events: [{
          name: 'start', from: 'RED', to: 'GREEN'
        }]
      })
      expect(fsm.currentState).toBe('RED')
    })

    it('has methods for each event name', () => {
      const fsm = StateMachine.create({
        events: [{
          name: 'go', from: 'red', to: 'green',
        }, {
          name: 'slow', from: 'green', to: 'yellow'
        }, {
          name: 'stop', from: 'yellow', to: 'red'
        }]
      })

      expect(typeof fsm.go).toBe('function')
      expect(typeof fsm.slow).toBe('function')
      expect(typeof fsm.stop).toBe('function')
    })
  })

  describe('transitions', () => {
    it('handles an init function', () => {
      const fsm = StateMachine.create({
        events: [{
          name: 'init', from: ['NO STATE', 'off'], to: 'on',
        }, {
          name: 'off', from: 'on', to: 'off'
        }]
      })

      expect(fsm.currentState).toBe('NO STATE')
      fsm.init()
      expect(fsm.currentState).toBe('on')
      fsm.off()
      expect(fsm.currentState).toBe('off')
      fsm.init()
      expect(fsm.currentState).toBe('on')

      fsm.onoff()
    })
  })
})