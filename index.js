const fetch = require('node-fetch');
const nodemailer = require('nodemailer');
const qrcode = require('qrcode');
const fs = require('fs-extra');


/* It exports a function named `send_email` that takes in three parameters: `auth`, `options`, and
`callback`. The function uses the `nodemailer` library to create a transport object with the
specified `auth` credentials and then sends an email using the `sendMail` method of the transport
object with the given `options`. The `callback` function is called with an error or a success
message depending on whether the email was sent successfully or not. */
module.exports.sendMail = (auth, options, callback) => {
    // auth: { user, pass }
    // options: { from, to, subject, html }
    let nodeMailer = nodemailer.createTransport({
        service: 'Gmail',
        auth: auth
    });

    nodeMailer.sendMail(options, callback);
};

/* This code exports a function named `fetch_api` that takes in three parameters: `url`, `options`, and
`callback`. It uses the `fetch` function from the `node-fetch` library to make an HTTP request to
the specified `url` with the given `options`. It then parses the response as JSON and checks if the
`success` property of the resulting object is true. If it is, the function returns the `data`
property of the object. If not, it calls the `callback` function with the `msg` property of the
object. If there is an error during the HTTP request, the function also calls the `callback`
function with the error. The function is marked as `async` and returns a promise that resolves with
the data or rejects with an error. */
module.exports.callBackend = async (url, options, callback) => {
    return await fetch('http://localhost:8000/api/' + url, options)
        .then(async result => {
            result = await result.json();
            
            if(result.success) {
                return result.data;
            }

            callback(result.msg);
        })
        .catch(err => {
            callback(err);
        })
        
}

/* This code exports a function named `exchange_rate` that takes in three parameters: `from`, `to`,
and `callback`. It makes an HTTP GET request to the `https://open.er-api.com/v6/latest/`
endpoint to get the latest exchange rate from the `from` currency to the `to` currency. It then
parses the response as JSON and checks if the `result` property of the resulting object is
'success'. If it is, the function returns the exchange rate from the `from` currency to the `to`
currency. If not, it calls the `callback` function with the object. If there is an error during
the HTTP request, the function also calls the `callback` function with the error. The function is
marked as `async` and returns a promise that resolves with the exchange rate or rejects with an
error. */
module.exports.exchangeRate = async (from, to, callback) => {
    return await fetch(`https://open.er-api.com/v6/latest/${from}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json'}
    })
    .then(async result => {
        result = await result.json();
        if(result.result == 'success') {
            return result.rates[to]
        }
        
        callback(result);
    })
    .catch(err => {
        callback(err);
    })
}

/* This code exports a function named `make_qrcode` that takes in two parameters: `data` and
`callback`. It uses the `qrcode` library to generate a QR code image from the `data` parameter by
converting it to a JSON string and then using the `toDataURL` method to generate a data URL for the
image. The function returns a promise that resolves with the data URL for the QR code image or
rejects with an error. If there is an error, the `callback` function is called with the error. */
module.exports.QRCODE = async (data, callback) => {
    return await qrcode.toDataURL(JSON.stringify(data))
        .then(code => {
            return code;
        })
        .catch(err => {
            callback(err);
        })
}



/* It exports a function named `mkDir` that takes in two parameters: `path` and `callback`. The
function checks if the directory specified by the `path` parameter exists. If it does not exist, the
function creates the directory using the `fs.mkdirSync` method with the `recursive` option set to
`true`. If there is an error during the directory creation, the `callback` function is called with
the error. */
module.exports.mkDir = (path, callback) => {
    if(!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true }, err => {
            return callback(err);
        })
    }
}

/* The `delFile` function is deleting a file at the specified `path` parameter. It first
checks if the file exists using the `fs.existsSync` method. If the file exists, it uses the
`fs.unlink` method to delete the file. If there is an error during the file deletion, the `callback`
function is called with the error. */
module.exports.delFile = (path, callback) => {
    if(fs.existsSync(path)) {
        fs.unlink(path, err => {
            if(err)
                return callback(err);
        });
    }
}

/* `rmDir` is a function that takes in two parameters: `path` and `callback`. It uses
the `fs.rm` method to remove the directory at the specified `path` parameter with the `recursive`
option set to `true`, which means that it will remove the directory and all its contents
recursively. If there is an error during the directory removal, the `callback` function is called
with the error. This function is used to delete a directory and all its contents. */
module.exports.rmDir = (path, callback) => {
    fs.rm(path, {recursive: true}, err => {
        if(err)
            return callback(err);
    })
}

/* This code exports a function named `mvDir` that takes in three parameters: `oldpath`, `newpath`, and
`callback`. The function checks if the `oldpath` and `newpath` parameters are different. If they
are, it checks if the `newpath` directory already exists using the `fs.existsSync` method. If it
exists, it removes the directory and all its contents recursively using the `fs.rm` method with the
`recursive` option set to `true`. Then, it renames the `oldpath` directory to the `newpath`
directory using the `fs.renameSync` method. If there is an error during the directory removal or
renaming, the `callback` function is called with the error. This function is used to move a
directory and all its contents from one location to another. */
module.exports.mvDir = (oldpath, newpath, callback) => {
    if(oldpath != newpath) {
        if(fs.existsSync(newpath)) {
            fs.rm(newpath, {recursive: true}, callback);
        }

        return fs.renameSync(oldpath, newpath)
    }
}

/* The `formatDate` function is a utility function that takes in a `date` parameter and
returns a formatted date string in the `vi-vn` locale. If the `date` parameter is a string, it is
converted to a `Date` object and then formatted. If the `date` parameter is already a `Date` object,
it is formatted directly. */
module.exports.formatDate = (date) => {
    if(typeof date == 'string') {
        return new Date(date).toLocaleDateString('vi-vn');
    }

    return date.toLocaleDateString('vi-vn');
}

/* This code exports a function named `formatCurrency` that takes in a `number` parameter and returns a
formatted currency string in the `vi-vn` locale. If the `number` parameter is a string, it is
converted to an integer by removing all the dots (using the `replaceAll` method) and then parsed
using the `parseInt` method. Then, the `toLocaleString` method is used to format the number as a
currency string with the `VND` currency code. */
module.exports.formatCurrency = (number) => {
    if(typeof number == 'string') {
        number = parseInt(number.replaceAll('.',''));
    }

    return number.toLocaleString('vi-vn', { style: 'currency', currency: 'VND'})
}


