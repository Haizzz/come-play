// define message types

type message =
  | {
      type: 'introduction'
      value: {
        name: string
        timestamp: number
      }
    }
  | {
      type: 'asdf'
      value: {}
    }

export default message
