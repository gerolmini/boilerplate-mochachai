const chai = require('chai');
const assert = chai.assert;

const server = require('../server');

const chaiHttp = require('chai-http');
chai.use(chaiHttp);

suite('Functional Tests', function () {
  this.timeout(5000);
  suite('Integration tests with chai-http', function () {
    // #1
    test('Test GET /hello with no name', function (done) {
      chai
        .request(server)
        .keepOpen()
        .get('/hello')
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'hello Guest');
          done();
        });
    });
    // #2
    test('Test GET /hello with your name', function (done) {
      chai
        .request(server)
        .keepOpen()
        .get('/hello?name=xy_z')
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'hello xy_z');
          done();
        });
    });
    // #3
    test('Send {surname: "Colombo"}', function (done) {
      chai
        .request(server)
        .keepOpen()
        .put('/travellers')
        .send({ 'surname': 'Colombo' })
        .end(function (err, res) {
          assert.equal(res.status, 200, 'response status should be 200');
          assert.equal(res.type, 'application/json', 'Response should be json');
          assert.equal(
            res.body.name,
            'Cristoforo',
            'res.body.name should be "Christoforo"'
          );
          assert.equal(
            res.body.surname,
            'Colombo',
            'res.body.surname should be "Colombo"'
          );
          done();
        });
    });
    // #4
    test('Send {surname: "da Verrazzano"}', function (done) {
      chai
        .request(server)
        .put('/travellers')
        .send({ surname: 'da Verrazzano' })
        /** place your tests inside the callback **/
        .end(function (err, res) {
          assert.equal(res.status, 200, 'response status should be 200');
          assert.equal(res.type, 'application/json', 'Response should be json');
          assert.equal(res.body.name, 'Giovanni');
          assert.equal(res.body.surname, 'da Verrazzano');
          done();
        });
    });
  });

  const Browser = require('zombie');

  suite('Functional Tests with Zombie.js', function () {
    this.timeout(5000);
    suiteSetup(function (done) { browser.visit('/', done); });
    Browser.site = 'https://3ac731a6-3420-4d3e-    b85a-931afcf31dea-00-1lc4tvrx1ir1o.janeway.replit.dev/';
    const browser = new Browser();

    suite('"Famous Italian Explorers" form', function () {
      // #5
      test('Submit the surname "Colombo" - write your e2e test...', function (done) {
        browser.fill('surname', 'Colombo').then(() => {
          browser.pressButton('submit', () => {
            browser.assert.success();
            browser.assert.text('span#name', 'Cristoforo');
            browser.assert.text('span#surname', 'Colombo');
            browser.assert.elements('span#dates', 1);
            done();
          });
        });
      });
      // #6
      test('submit surname "Vespucci" - write your e2e test...', function (done) {
        browser.fill('surname', 'Vespucci').then(() => {
          browser.pressButton('submit', function () {
            browser.assert.success();
            browser.assert.text('span#name', 'Amerigo');
            browser.assert.text('span#surname', 'Vespucci'); browser.assert.elements('span#dates', 1);
            done();
          });
        });
      });

    });
  });

});  
