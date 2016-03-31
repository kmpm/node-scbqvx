require('dotenv').config();
var expect = require('chai').expect;
var lib = require('../lib');

var scb = new lib.ScbClient();

describe('ScbClient', function () {

  it('should get something', function (done) {
    scb.getApi('en/ssd/')
    .then(function (data) {
      expect(data).to.be.an('Array');
      data.forEach(function (d) {
          expect(d).to.have.property('id');
      });

      done();
    })
    .catch(done);
  });

  it('should get subjectAreas', function (done) {
    scb.getSubjectAreas()
    .then(function (data) {
      expect(data).to.be.an('Array');
      data.forEach(function (d) {
          expect(d).to.have.property('id');
      });
      console.log('%j', data);
      done();
    })
    .catch(done);
  });

});
