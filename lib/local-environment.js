'use strict'

const Ast = require('./node/ast')

const envStack = []
class LocalEnvironment {
  constructor (envParameters, parent) {
    const env = {}
    Object.keys(envParameters).forEach((key) => {
      env[key] = new Ast.Variable(
        envParameters[key].type,
        envParameters[key].value
      )
    })
    this.env = env
    this.parent = parent
  }

  define (type, key, value) {
    this.env[key] = new Ast.Variable(type, value)
  }

  set (key, value) {
    this.env[key].value = value
  }

  get (key) {
    return this.env[key]
  }

  includes (key) {
    return key in this.env
  }

  static get (key, env) {
    if (!env) env = this.currentScope()
    const value = env.get(key)
    if (value) {
      return value
    } else if (env.parent) {
      return this.get(key, env.parent)
    } else {
      throw new Error(`Undefined Variable ${key}`)
    }
  }

  static set (key, value, env) {
    if (!env) env = this.currentScope()
    if (env.includes(key)) {
      env.set(key, value)
    } else if (env.parent) {
      this.set(key, value, env.parent)
    } else {
      throw new Error(`Undefined Variable ${key}`)
    }
  }

  static includes (key, env) {
    if (!env) env = this.currentScope()
    if (env.includes(key)) {
      return true
    } else if (env.parent) {
      return this.includes(key, env.parent)
    } else {
      return false
    }
  }

  static currentScope () {
    return envStack[envStack.length - 1]
  }

  static pushScope (env, parent) {
    const localEnv = new LocalEnvironment(env, parent)
    envStack.push(localEnv)
  }

  static popScope () {
    envStack.pop()
  }

  static create (env) {
    const localEnv = new LocalEnvironment()
    Object.keys(env).forEach((key) => {

    })
  }
}

module.exports = LocalEnvironment
