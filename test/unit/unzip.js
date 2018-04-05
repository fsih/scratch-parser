var fs = require('fs');
var path = require('path');
var test = require('tap').test;
var JSZip = require('jszip');
var unzip = require('../../lib/unzip');

var fixtures = {
    sb: path.resolve(__dirname, '../fixtures/data/_example.sb'),
    sb2: path.resolve(__dirname, '../fixtures/data/_example.sb2'),
    gzipJSON: path.resolve(__dirname, '../fixtures/data/_example.json.gz'),
    zipFakeProjectJSON:
        path.resolve(__dirname, '../fixtures/data/_zipFakeProjectJson.zip'),
    zipNoProjectJSON:
        path.resolve(__dirname, '../fixtures/data/_zipNoProjectJson.zip')
};

for (var i in fixtures) {
    fixtures[i] = fs.readFileSync(fixtures[i]);
}

test('spec', function (t) {
    t.type(unzip, 'function');
    t.end();
});

test('sb', function (t) {
    var buffer = new Buffer(fixtures.sb);
    unzip(buffer, false, function (err, res) {
        t.type(err, 'string');
        var errorMessage = 'Failed to unzip and extract project.json';
        t.equal(err.startsWith(errorMessage), true);
        t.type(res, 'undefined');
        t.end();
    });
});

test('sb2', function (t) {
    var buffer = new Buffer(fixtures.sb2);
    unzip(buffer, false, function (err, res) {
        t.equal(err, null);
        t.equal(Array.isArray(res), true);
        t.type(res[0], 'string');
        t.doesNotThrow(function () {
            JSON.parse(res[0]);
        });
        t.equal(res[1] instanceof JSZip, true);
        t.end();
    });
});

test('gzipped JSON', function (t) {
    var buffer = new Buffer(fixtures.gzipJSON);
    unzip(buffer, true, function (err, res) {
        t.equal(err, null);
        t.equal(Array.isArray(res), true);
        t.type(res[0], 'string');
        t.doesNotThrow(function () {
            JSON.parse(res[0]);
        });
        t.equal(res[1], null);
        t.end();
    });
});

test('zip without project json', function (t) {
    var buffer = new Buffer(fixtures.zipNoProjectJSON);
    unzip(buffer, false, function (err, res) {
        t.type(err, 'string');
        var errorMessage = 'Failed to unzip and extract project.json';
        t.equal(err.startsWith(errorMessage), true);
        t.type(res, 'undefined');
        t.end();
    });
});

test('zip with fake project json', function (t) {
    var buffer = new Buffer(fixtures.zipFakeProjectJSON);
    unzip(buffer, false, function (err, res) {
        t.equal(err, null);
        t.equal(Array.isArray(res), true);
        t.type(res[0], 'string');
        t.equal(res[0], 'this is not json\n');
        t.throws(function () {
            JSON.parse(res[0]);
        });
        t.equal(res[1] instanceof JSZip, true);
        t.end();
    });
});

test('random string instead of zip #1', function (t) {
    unzip('this is not a zip', false, function (err, res) {
        t.type(err, 'string');
        var errorMessage = 'Failed to unzip and extract project.json';
        t.equal(err.startsWith(errorMessage), true);
        t.type(res, 'undefined');
        t.end();
    });
});

test('random string instead of zip #2', function (t) {
    unzip('this is not a zip', true, function (err, res) {
        t.type(err, 'string');
        var errorMessage = 'Failed to unzip and extract project.json';
        t.equal(err.startsWith(errorMessage), true);
        t.type(res, 'undefined');
        t.end();
    });
});

test('undefined', function (t) {
    var foo;
    unzip(foo, false, function (err, obj) {
        t.type(err, 'string');
        var errorMessage = 'Failed to unzip and extract project.json';
        t.equal(err.startsWith(errorMessage), true);
        t.type(obj, 'undefined');
        t.end();
    });
});

test('undefined isGZip', function (t) {
    var foo;
    unzip(foo, true, function (err, obj) {
        t.type(err, 'string');
        var errorMessage = 'Failed to unzip and extract project.json';
        t.equal(err.startsWith(errorMessage), true);
        t.type(obj, 'undefined');
        t.end();
    });
});

test('null', function (t) {
    unzip(null, false, function (err, obj) {
        t.type(err, 'string');
        var errorMessage = 'Failed to unzip and extract project.json';
        t.equal(err.startsWith(errorMessage), true);
        t.type(obj, 'undefined');
        t.end();
    });
});

test('null isGZip', function (t) {
    unzip(null, true, function (err, obj) {
        t.type(err, 'string');
        var errorMessage = 'Failed to unzip and extract project.json';
        t.equal(err.startsWith(errorMessage), true);
        t.type(obj, 'undefined');
        t.end();
    });
});

test('object', function (t) {
    unzip({}, false, function (err, obj) {
        t.type(err, 'string');
        var errorMessage = 'Failed to unzip and extract project.json';
        t.equal(err.startsWith(errorMessage), true);
        t.type(obj, 'undefined');
        t.end();
    });
});

test('object isGZip', function (t) {
    unzip({}, true, function (err, obj) {
        t.type(err, 'string');
        var errorMessage = 'Failed to unzip and extract project.json';
        t.equal(err.startsWith(errorMessage), true);
        t.type(obj, 'undefined');
        t.end();
    });
});
