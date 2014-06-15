#!/usr/bin/env node

var express = require('express');
var path = require('path');
var logger = require('morgan');
var routes = require('./routes');

var app = express();

// app port setup
app.set('port', process.env.PORT || 3000);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    'use strict';
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: err
    });
});

// starting server
var server = app.listen(app.get('port'), function () {
    'use strict';
    console.info('Express server listening on port ' + server.address().port);
});
