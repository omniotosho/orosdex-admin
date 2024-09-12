var express       	= require('express');
var path          	= require('path');
var favicon       	= require('serve-favicon');
var logger        	= require('morgan');
var cookieParser  	= require('cookie-parser');
var bodyParser    	= require('body-parser');
var handlebars    	= require('express-handlebars');
var fileUpload    	= require('express-fileupload');
var session       	= require('express-session');
var responseTime  	= require('response-time');

var index         	= require('./routes/index');
var dashboard     	= require('./routes/dashboard');
var auth     	  	= require('./routes/auth');
var settings 	  	= require('./routes/settings');
var profile       	= require('./routes/profile');
var auctions      	= require('./routes/auctions');
var logout        	= require('./routes/logout');
var deposits      	= require('./routes/deposits');
var gls      	  	= require('./routes/gls');
var investments   	= require('./routes/investments');
var equities   	  	= require('./routes/equities');
var admin_settings 	= require('./routes/admin-settings');
var loans 			= require('./routes/loans');
var savings         = require('./routes/savings');
var customer        = require('./routes/customer');
var withdraw     	= require('./routes/withdraw');
var prices         	= require('./routes/prices');
var reports         = require('./routes/reports');
var treasury        = require('./routes/treasury');
var etfs        	= require('./routes/etfs');
var bonds        	= require('./routes/bonds');
var uploads        	= require('./routes/uploads');

var app = express();

// enable files upload
app.use(fileUpload({
	createParentPath: true,
	useTempFiles : true,
	tempFileDir : '/tmp/',
	safeFileNames: /\\/g
}));

app.use(express.static(path.join(__dirname, 'public')));
app.engine('handlebars', handlebars('main'));
app.set('view engine', 'handlebars');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(session({
	secret: 'delino12',
	// store: new redisStore({ host: 'localhost', port: 6379, client: client,ttl : 260}),
	resave: true,
	saveUninitialized: true,
	cookie: { 
		path: '/',
		_expires: new Date(Date.now() + 3600000 * 12 * 12),
		originalMaxAge: 3600000 * 12 * 12,
		httpOnly: false,
		secure: false
	}
}));

app.use(function (req, res, next) {
	res.setHeader('Accept', 'application/json');
	res.setHeader('Accept', 'application/x-www-form-urlencoded');
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
	next()
});

app.use(logger('dev'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(cookieParser());

// use response-time as a middleware
app.use(responseTime());

app.use('/', index);
app.use('/auth', auth);
app.use('/dashboard', dashboard);
app.use('/settings', settings);
app.use('/profile', profile);
app.use('/logout', logout);
app.use('/auctions', auctions);
app.use('/deposits', deposits);
app.use('/gls', gls);
app.use('/investments', investments);
app.use('/equities', equities);
app.use('/admin-settings', admin_settings);
app.use('/loans', loans);
app.use('/savings', savings);
app.use('/customer', customer);
app.use('/withdraw', withdraw);
app.use('/prices', prices);
app.use('/reports', reports);
app.use('/treasury', treasury);
app.use('/etfs', etfs);
app.use('/bonds', bonds);
app.use('/uploads', uploads);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
