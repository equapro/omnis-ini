
const omnis_calls = require('omnis_calls');
const fs = require('fs');
const ini = require('js-ini');

let autoSendResponse = true; // Set to false in methods which should not send a response to Omnis when they exit. (e.g. async methods)

const methodMap = {
    /* =================================
     *  Reading ini file
     * ================================= */
	read: function(param) {
        var filename = param.filename;
        var status = true;
        var content;
        var error;

        try {
            content = ini.parse(fs.readFileSync(filename, 'utf-8'));
        } catch(e) {
            error = e;
            status = false;
        }

        return {
            'content': content,
            'status': status,
            'error': error
        };
	},
    /* =================================
     *  Writing ini file
     * ================================= */
    write: function (param) {
        var filename = param.filename;
        var config = param.config;
        var status = true;
        var error;

        try {
            fs.writeFileSync(filename, ini.stringify(config));
        } catch(e) {
            error = e;
            status = false;
        }

        return {
            'status': status,
            'error': error
        };
    }
};


module.exports = {
	call: function (method, param, response) { // The only requirement of an Omnis module is that it implement this function.
		autoSendResponse = true;

		if (methodMap[method]) {
			const result = methodMap[method](param, response);
			if (autoSendResponse) {
                omnis_calls.sendResponse(result, response);
            }

			return true;
		} else {
			throw Error("Method '" + method + "' does not exist");
		}
	}
};
