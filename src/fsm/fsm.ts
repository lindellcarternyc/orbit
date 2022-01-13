type State<S extends string> = S | 'NO STATE'

interface Event<E extends string, S extends string> {
  name: E
  from: State<S> | State<S>[]
  to:   State<S>
}

type FiniteStateMachine<S extends string, E extends string> = {
  currentState: State<S>
} & {
  [K in E]: () => void
} & {
  [K in `on${E}`]: () => void
}

type FiniteStateMachineArgs<S extends string, E extends string> = {
  initalState?: State<S>
  events: Event<E, S>[]
} & {
  callbacks?: {
    [K in `on${E}`]?: () => void
  }
}

type EventMap<E extends string, S extends string> = Record<E, {
  name: E
  from: Set<State<S>>
  to:   State<S>
}>

const NO_OP = () => { return }

const StateMachine = Object.freeze({
  create<S extends string, E extends string>(args: FiniteStateMachineArgs<S, E>): FiniteStateMachine<S, E> {
    const fsm: Record<string, unknown> & { currentState: State<S> } = {
      currentState: args.initalState || 'NO STATE'
    }

    const events = { } as EventMap<E, S>

    for (const event of args.events) {
      const from = typeof event.from === 'string'
        ? [event.from]
        : event.from

      if (events[event.name] !== undefined) {
        from.forEach(f => events[event.name].from.add(f))
      } else {
        events[event.name] = {
          name: event.name,
          from: new Set(from),
          to: event.to
        }
        fsm[event.name] = () => {
          const evt = events[event.name]

          if (evt.from.has(fsm['currentState'])) {
            fsm.currentState = evt.to
          } else {
            throw new Error('IMPOSSIBLE STATE TRANSITION')
          }
        }

        if (args.callbacks && args.callbacks[`on${event.name}`]) {
          fsm[`on${event.name}`] = args.callbacks[`on${event.name}`]
        } else {
          fsm[`on${event.name}`] = NO_OP
        }
      }
    }
    return fsm as FiniteStateMachine<S, E>
  }
})


export default StateMachine