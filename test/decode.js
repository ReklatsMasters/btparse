'use strict'

var test = require('tape')
var decode = require('../')
var from = require('../lib/from')
var compare = require('buffer-compare')

test('int', function (t) {
  t.equal(decode('i2e'), 2)
  t.equal(decode('i-23e'), -23)

  t.throws(function () {
    decode('i2')
  })
  t.throws(function () {
    decode('ie')
  })

  t.end()
})

test('string', function (t) {
  t.is(compare(decode('2:ab'), from('ab')), 0)

  t.throws(function () {
    decode('2:a')
  })
  t.throws(function () {
    decode('-2:ab')
  })

  t.end()
})

test('list', function (t) {
  t.deepEqual(decode('le'), [])
  t.deepEqual(decode('li2ee'), [2])
  t.deepEqual(decode('li2e2:abe'), [2, from('ab')])
  t.deepEqual(decode('lli1eee'), [[1]])

  t.end()
})

test('dict', function (t) {
  t.deepEqual(decode("d2:abi2ee"), {ab: 2})
  t.deepEqual(decode("d2:abli2eee"), {ab: [2]})
  t.deepEqual(decode("d2:ab2:cde"), {ab: from('cd')})
  t.deepEqual(decode("d2:abdee"), {ab: {}})

  t.throws(function () {
    decode("di1ei2ee")
  })
  t.throws(function () {
    decode("dlei2ee")
  })
  t.throws(function () {
    decode("ddei2ee")
  })

  t.end()
})

test('depth', function (t) {
  t.deepEqual(decode('d2:abi2e2:bbd2:ccleee', {depth: 0}), {ab: 2, bb: {cc: []}})
  t.deepEqual(decode('d2:abi2e2:bbd2:ccleee', {depth: 1}), {ab: 2, bb: from('d2:cclee')})

  t.end()
})
