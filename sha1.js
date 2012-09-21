/*
 * @name: sha1.js
 * @description: 
 * @author: wondger@gmail.com
 * @date: 2012-09-19
 * @param: 
 * @todo: 
 * @changelog: 
 */
var crypto = require('crypto'),

    hash = function(data) {
        var data = data || null;
            method = "sha1",
            input_encoding = "utf8",
            output_encoding = "base64";

        if (data === null) {
            return data;
        }

        var shasum = crypto.createHash(method);

        shasum.update(data, input_encoding);

        return shasum.digest(output_encoding);
    };

module.exports = hash;
