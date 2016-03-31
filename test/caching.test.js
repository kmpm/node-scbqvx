require('dotenv').config();
var expect = require('chai').expect;
var lib = require('../lib');

var cache = new lib.Caching();

describe('Caching', function () {

  it('should set', function (done) {
    var v = Date.now().toString();
    cache.set('should set', v)
    .then(function (success) {
      expect(success).to.equal(v);
      done();
    })
    .catch(done);
  });

  it('should get', function (done) {
    var k = 'should get';
    var v = Date.now().toString();
    cache.set(k, v)
    .then(function (success) {
      expect(success).to.equal(v);
      return cache.get(k);
    })
    .then(function (value) {
      expect(value).to.equal(v);
      done();
    })
    .catch(done);
  });

  it('should remove', function (done) {
    var k = 'should remove';
    var v = Date.now().toString();
    cache.set(k, v)
    .then(function (success) {
      expect(success).to.equal(v);
      return cache.remove(k);
    })
    .then(function (value) {
      expect(value).to.be.null;
      return cache.get(k);
    })
    .then(function (value) {
      expect(value).to.be.null;
      done();
    })
    .catch(done);
  });

});
