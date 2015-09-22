import {addRoutes} from './router'

describe('lucid-router', () => {
  it('addRoutes', () => {
    expect(() => addRoutes()).toThrowError()
    expect(() => addRoutes([])).not.toThrowError()
    expect(() => addRoutes([null])).toThrowError()
    expect(() => addRoutes([{name: 'a'}])).toThrowError()
    expect(() => addRoutes([{name: 'a', path: '/a'}])).not.toThrowError()
  })

  it('removeRoute', () => {
    expect(() => removeRoute('a')).not.toThrowError()
  })
})
