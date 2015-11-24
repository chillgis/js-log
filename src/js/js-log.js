/*!
 * js-log 0.0.1
 * http://js-log.cardone.top/
 *
 *
 * Copyright 2005, 2014 mdyht
 * Released under the MIT license
 * http://js-log.cardone.top/license
 *
 * Date: 2015-11-23T23:01Z
 */
(function (factory) {
    var root = (typeof self == 'object' && self.self == self && self) || (typeof global == 'object' && global.global == global && global);

    if (typeof define === 'function' && define.amd) {
        define(['jquery', 'exports'], function ($, exports) {
            root.jsLog = factory(root, exports, $);
        });
    } else if (typeof exports !== 'undefined') {
        try {
            $ = require('jquery');
        } catch (e) {
        }

        root.jsLog = factory(root, exports, $);
    } else {
        root.jsLog = factory(root, {}, (root.jQuery || root.$));
    }

}(function (root, jsLog, $) {
    var previousJsLog = root.JsLog;

    jsLog.noConflict = function () {
        root.JsLog = previousJsLog;

        return this;
    };

    jsLog.options = {
        level: "debug",
        sendLevel: "debug",
        url: "",
        emulateJSON: false
    };

    jsLog.config = function (options) {
        $.extend(jsLog.options, options);
    };

    var logLevel = {
        "debug": 0,
        "info": 1,
        "warn": 2,
        "error": 4
    };

    $.each(logLevel, function (k, v) {
        jsLog[k] = function (message, ex) {
            if (logLevel[jsLog.options.level] > v) {
                return false;
            }

            if (root.console) {
                root.console.log(message);
            }

            if (!jsLog.options.url) {
                return false;
            }

            if (logLevel[jsLog.options.sendLevel] > v) {
                return false;
            }

            var data = {
                level: k,
                message: message
            };

            if (message) {
                data.message = message;
            }

            if (ex) {
                data.ex = ex;
            }

            var params = {type: "POST", dataType: 'json'};

            if (jsLog.options.emulateJSON) {
                params.contentType = 'application/json';
                params.data = JSON.stringify(data);
            } else {
                params.contentType = 'application/x-www-form-urlencoded';
                params.data = data;
            }

            $.ajax($.extend(params, jsLog.options));

            return true;
        };
    });

    return jsLog;
}));