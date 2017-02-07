'use strict'

const next = require('./lib/lexer')
const parser = require('./lib/parser')

module.exports = decode

function decode(data) {
  const buffer = Buffer.isBuffer(data) ? data : Buffer.from(data)

  const ptr = {
    i: 0,
    buffer,
    length: buffer.length // save space in IC
  }

  return parser.select(ptr, next(ptr, -1))
}
