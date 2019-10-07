/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');
let id;

chai.use(chaiHttp);

suite('Functional Tests', function() {
  
    suite('POST /api/issues/{project} => object with issue data', function() {
      
      test('Every field filled in', function(done) {
       chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json', "Response should be json");
          assert.equal(res.body.issue_title, 'Title');
          assert.equal(res.body.issue_text, 'text');
          assert.equal(res.body.created_by, 'Functional Test - Every field filled in');
          assert.equal(res.body.assigned_to, 'Chai and Mocha');
          assert.equal(res.body.status_text, 'In QA');
          id = res.body._id;
          done();
        });
      });
      
      test('Required fields filled in', function(done) {
       chai.request(server)
        .post('/api/issues/test1')
        .send({
          issue_title: 'Title1',
          issue_text: 'text1',
          created_by: 'Functional Test1 - Every field filled in',
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json', "Response should be json");
          assert.equal(res.body.issue_title, 'Title1');
          assert.equal(res.body.issue_text, 'text1');
          assert.equal(res.body.created_by, 'Functional Test1 - Every field filled in');
          assert.equal(res.body.assigned_to, '');
          assert.equal(res.body.status_text, '');

          done();
        });        
      });
      
      test('Missing required fields', function(done) {
       chai.request(server)
        .post('/api/issues/test2')
        .send({
          issue_title: 'Title2',
          issue_text: 'text2'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'Missing required fields');

          done();
        });              
      });
      
    });
    
    suite('PUT /api/issues/{project} => text', function() {
      
      test('No body', function(done) {
        chai.request(server)
        .put('/api/issues/text')
        .send({
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'No body');
          
          done();
        });       
        
      });
      
      test('One field to update', function(done) {
        chai.request(server)
        .put('/api/issues/text')
        .send({
          _id: id,
          issue_title: 'text2',
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, "Updated suceed")
          
          done();
        });          
      });
      
      test('Multiple fields to update', function(done) {
        chai.request(server)
        .put('/api/issues/text')
        .send({
          _id: id,
          issue_title: 'title3',
          issue_text: 'text3',
          created_by: 'Functional Test - Multiple fiels to update',
          assigned_to: 'assigned3',
          status_text: 'status3'          
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, "Updated suceed")
          
          done();
        });           
      });
      
    });
    
    suite('GET /api/issues/{project} => Array of objects with issue data', function() {
      
      test('No filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });
      
      test('One filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({issue_title: 'Title'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });        
      });
      
      test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({issue_title: 'Title',issue_text: 'text'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });             
      });
      
    });
    
    suite('DELETE /api/issues/{project} => text', function() {
      
      test('No _id', function(done) {
        chai.request(server)
        .delete('/api/issues/text')
        .send({
          _id: '5'     
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'No ID found')
          
          done();
        });                
      });
      
      test('Valid _id', function(done) {
        chai.request(server)
        .delete('/api/issues/text')
        .send({
          _id: id    
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'deleted:' + id)
          
          done();
        });               
      });
      
    });

});
