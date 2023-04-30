const fetch = require('node-fetch');
const nodemailer = require('nodemailer');
const qrcode = require('qrcode');


// auth: { user, pass }
// options: { from, to, subject, html }
module.exports.send_email = (auth, options, callback) => {
    let nodeMailer = nodemailer.createTransport({
        service: 'Gmail',
        auth: auth
    });

    nodeMailer.sendMail(options, callback);
};

module.exports.call_api = async (url, options, callback) => {
    return await fetch(url, options)
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

module.exports.exchange_rate = async (from, to, callback) => {
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

module.exports.make_qrcode = async (data, callback) => {
    return await qrcode.toDataURL(JSON.stringify(data))
        .then(code => {
            return code;
        })
        .catch(err => {
            callback(err);
        })
}

