var mysql = require('mysql');
const Alexa = require('alexa-sdk');
const AWS = require('aws-sdk')


const AWSregion = 'us-east-1';  // us-east-1

AWS.config.update({
    region: AWSregion
});

var pool = mysql.createPool({
    host: "alexatest.ccjrjmsf5cj5.us-east-1.rds.amazonaws.com",
    user: "prathmesh",
    password: "Aug2017!!",
    database: "alexa"
});


exports.handler = (event, context, callback) =>
{
    var alexa = Alexa.handler(event, context);
    alexa.registerHandlers(handlers);
    alexa.execute();
}
;


const handlers = {
    'LaunchRequest': function () {
        this.response.speak('Welcome to the warehouse');
        this.emit(':responseReady');
    },

    'MyIntent': function () {

        //var MyQuestion = this.event.request.intent.slots.MyQuestion.value;
        //console.log('MyQuestion : ' + MyQuestion);
        var that = this;
        var response = this.response;
        var params = {};
        console.log("Before Connection");

        readSQLItem(params, function (myResult) {
            var say = '';
            say = myResult;
            response.speak(say);
            that.emit(':responseReady');
        });
    },

    'GetStockOfProducts': function () {

        var ProductName = this.event.request.intent.slots.Name.value;
        //var ProductName = this.event.request.intent.slots;
        console.log('MyProduct : ' + JSON.stringify(ProductName));
        var that = this;
        var response = this.response;
        var params = ProductName;

        getStockSQL(params, function (myResult) {
            var say = "";
            if (myResult)
                say = myResult;
            else
                say = "Error in retrieving data";
            response.speak(say);
            that.emit(':tell',say);
        });


    },

    'GetPriceOfProducts': function () {
        var ProductName = this.event.request.intent.slots.Name.value;
        //var ProductName = this.event.request.intent.slots;
        console.log('MyProduct : ' + JSON.stringify(ProductName));
        var that = this;
        var response = this.response;
        var params = ProductName;

        getPriceSQL(params, function (myResult) {
            var say = "";
            if (myResult)
                say = myResult;
            else
                say = "Error in retrieving data";
            response.speak(say);
            that.emit(':responseReady');
        });
    },

    'GetSalesOfProduct': function () {

        var ProductName = this.event.request.intent.slots.Name.value;
        //var ProductName = this.event.request.intent.slots;
        console.log('MyProduct : ' + JSON.stringify(ProductName));
        var that = this;
        var response = this.response;
        var params = ProductName;
        console.log("Before Connection");

        getSalesSQL(params, function (myResult) {
            var say = "";
            if (myResult)
                say = myResult;
            else
                say = "Error in retrieving data";
            response.speak(say);
            that.emit(':responseReady');
        });


    },

    'GetSalesOfDate': function () {

        var DateValue = this.event.request.intent.slots.Date.value;
        //var DateValue = this.event.request.intent.slots;
        console.log('MyDate : ' + JSON.stringify(DateValue));
        var that = this;
        var response = this.response;
        var params = DateValue;
        getSalesofDateSQL(params, function (myResult) {
            if (myResult)
                say = myResult;
            else
                say = "Error in retrieving data";
            response.speak(say);
            that.emit(':responseReady');
        });
    },

    'GetSalesOfProductOnDate': function () {

        var DateValue = this.event.request.intent.slots.Date.value;
        var ProductName = this.event.request.intent.slots.Name.value;
        var that = this;
        var response = this.response;
        var params = {
            "date": DateValue,
            "productname": ProductName
        };
        getSalesofProductOnDateSQL(params, function (myResult) {
            if (myResult)
                say = myResult;
            else
                say = "Error in retrieving data";
            response.speak(say);
            that.emit(':responseReady');
        });
    },

    'GetPaymentOfProducts': function () {

        //var ProductName = this.event.request.intent.slots.Name.value;
        var DateValue = this.event.request.intent.slots.Date.value;
        console.log('MyProduct : ' + JSON.stringify(DateValue));
        var that = this;
        var response = this.response;
        var params = DateValue;

        getPaymentSQL(params, function (myResult) {
            var say = "";
            if (myResult)
                say = myResult;
            else
                say = "Error in retrieving data";
            response.speak(say);
            that.emit(':responseReady');
        });


    },

    'UnhandledIntent': function () {
        this.response.speak('Sorry I could not understand. Could you try again').listen('Please Try again');
        this.emit(':responseReady');
    },

    'AMAZON.HelpIntent': function () {
        this.response.speak('How can I help you.').listen('try again');
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        this.response.speak('Goodbye!');
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.response.speak('Goodbye!');
        this.emit(':responseReady');
    }
};

//    END of Intent Handlers {} ========================================================================================
// 3. Helper Function  =================================================================================================

function readSQLItem(params, callback) {


    pool.getConnection(function (err, connection) {
        connection.query('SELECT ProductName from Products where ProductId=1', function (error, results, fields) {
            connection.release();
            if (error) callback(error);
            else {
                if (results.length > 0) {
                    console.log("Result: " + results[0].ProductName);
                    callback(results[0].ProductName);
                }
                else {
                    console.log("No data");
                    callback(results[0].ProductName);
                }

            }

        });
    });

};

function getStockSQL(params, callback) {

    if (params)
    {
        pool.getConnection(function (err, connection) {
            connection.query('SELECT Stock from Products where ProductName = "' + params + '"', function (error, results, fields) {
                connection.release();
                if (error) callback(error);
                else {
                    if (results.length > 0) {
                        console.log("Result: " + results[0].Stock);
                        callback("The Stock of " + params + " in the warehouse is " + results[0].Stock);
                    }
                    else {
                        console.log("No data");
                        callback("The product "+ params+ " does not exist in the database.");
                    }
                }
            });
        });
    }
    else
    {
        callback("The product does not exist in the database.");
    }
};

function getPriceSQL(params, callback) {

    if(params)
    {
        pool.getConnection(function (err, connection) {
            connection.query('SELECT RetailPrice from Products where ProductName = "' + params + '"', function (error, results, fields) {
                connection.release();
                if (error) callback(error);
                else {
                    if (results.length > 0) {
                        console.log("Result: " + results[0].RetailPrice);
                        callback("The price of a " + params + " is " + results[0].RetailPrice + " dollars");
                    }
                    else {
                        console.log("No data");
                        callback("The product "+ params+ " does not exist in the database.");
                    }
                }
            });
        });
    }
    else
    {
        callback("The product does not exist in the database.");
    }

};

function getSalesSQL(params, callback) {

    if(params)
    {
        pool.getConnection(function (err, connection) {
            connection.query('SELECT SUM(Quantity) as Quantity1 from Sales where ProductId in ( SELECT ProductId FROM Products where ProductName = "' + params + '")', function (error, results, fields) {
                connection.release();
                if (error) callback(error);
                else {
                    if (results.length > 0) {

                        if(results[0].Quantity1 == null)
                        {
                            console.log("Result: " + results[0].Quantity1);
                            callback("No " + params + " were sold according to our transaction history.");
                        }
                        else
                        {
                            console.log("Result: " + results[0].Quantity1);
                            callback("The total quantity of " + params + " sold is " + results[0].Quantity1 + "");
                        }
                    }
                    else {
                        console.log("No data");
                        callback("The product "+ params+ " does not exist in the database.");
                    }
                }
            });
        });
    }
    else
    {
        callback("The product does not exist in the database.");
    }

};

function getSalesofDateSQL(params, callback) {

    pool.getConnection(function (err, connection) {
        connection.query('SELECT SUM(Total) as total from Sales where Date ="' + params + '"', function (error, results, fields) {
            connection.release();
            if (error) callback(error);
            else {
                if (results.length > 0) {

                    if(results[0].total == null)
                    {
                        console.log("Result: " + results[0].Quantity1);
                        callback("There was no sale on " + params + " ");
                    }
                    else
                    {
                        console.log("Result: " + results[0].total);
                        callback("The total sale on " + params + " is " + results[0].total + " dollars");
                    }

                }
                else {
                    console.log("No data");
                    callback("There was no sale on " + params + " ");
                }
            }
        });
    });

};

function getSalesofProductOnDateSQL(params, callback) {

    if( params.productname )
    {
        pool.getConnection(function (err, connection) {
            connection.query('SELECT SUM(Total) as total from Sales where Date ="' + params.date + '" and ProductId in (SELECT ProductId from Products where ProductName ="' + params.productname + '")', function (error, results, fields) {
                connection.release();
                if (error) callback(error);
                else {
                    if (results.length > 0) {

                        if(results[0].total == null)
                        {
                            console.log("Result: " + results[0].total);
                            callback("There was no sale for  " + params.productname + " on  "+params.date);
                        }
                        else
                        {
                            console.log("Result: " + results[0].total);
                            callback("The total sale for  " + params.productname + " on " + params.date + " is " + results[0].total + " dollars");
                        }

                    }
                    else {
                        console.log("No data");
                        callback("There was no sale for  " + params.productname + " on  "+params.date);
                    }
                }
            });
        });
    }
    else
    {
        callback("The product does not exist in the database.");
    }
};

function getDuesForDateSQL(params, callback) {

    pool.getConnection(function (err, connection) {
        connection.query('SELECT SUM(Total) as total from Sales where Date ="' + params.date + '" and ProductId in (SELECT ProductId from Products where ProductName ="' + params.productname + '")', function (error, results, fields) {
            connection.release();
            if (error) callback(error);
            else {
                if (results.length > 0) {

                    if(results[0].total == null)
                    {
                        console.log("Result: " + results[0].total);
                        callback("There was no sale for the product " + params.productname + " on  "+params.date);
                    }
                    else
                    {
                        console.log("Result: " + results[0].total);
                        callback("The total sale for the product " + params.productname + " on " + params.date + " is " + results[0].total + " dollars");
                    }

                }
                else {
                    console.log("No data");
                    callback("There is no product named " + params.productname);
                }
            }
        });
    });
};

function getPaymentSQL(params, callback) {

    pool.getConnection(function (err, connection) {
        connection.query('SELECT ProductName from Products where ProductId in(Select ProductId from Sales where Payment= 1 and DATE ="' + params +'")', function (error, results, fields) {
            connection.release();
            if (error) callback(error);
            else {
                if (results.length > 0) {

                    if(results[0].ProductName == null)
                    {
                        console.log("Result: " + results[0].ProductName);
                        callback("There are no Payments due on " + params);
                    }
                    else
                    {
                        console.log("Result: " + results[0].ProductName);
                        var product = "";
                        for ( i =0; i < results.length; i++)
                            product += results[i].ProductName + " , ";
                        callback("Products "+ product + "have there payments due " + "on " + params);
                        //callback("Payments for products " + product + "are due " + params );
                    }

                }
                else {
                    console.log("No data");
                    callback("There are no Payments due on " + params);
                }
            }
        });
    });
};

//here is a list of products whose payemnts are due on date list