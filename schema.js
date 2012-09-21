/*
 * @name: schema.js
 * @description: FETest schema
 * @author: wondger@gmail.com
 * @date: 2012-09-19
 * @param: 
 * @todo: 
 * @changelog: 
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var
    /*
     * 问题
     */
    Question = new Schema({
        content: {
            "type": String,
            "required": true,
            "validate": /.+/
        },
        steps: {
            "type": Array,
            "required": false
        },
        level: {
            "type": Number,
            "required": true,
            "enmu": [1, 2, 3],
            "default": 1
        },
        skill: {
            "type": String,
            "required": true,
            "enmu": ["css", "javascript", "html", "mixed"],
            "default": "mixed"
        },
        type: {
            "type": String,
            "required": false,
            "enmu": ["single", "step", "study"],
            "default": "single"
        },
        created: {
            "type": Date,
            "required": true
        },
        author: {
            "type": String,
            "default": ""
        },
        /*
         * 题目期望完成时间
         */
        time: {
            "type": Number,
            "required": true
        },
        /*
         * 题目分析，前台用户不可见，为评卷参考
         */
        remark: {
            "type": String
        },
        deleted: {
            "type": Boolean,
            "default": false,
            "required": true
        }
    }),
    /*
     *用户
     */
    User = new Schema({
        email: {
            "type": String,
            "trim": true,
            "required": true,
            "validate": /[-\w\.]+@\w+(?:(?:\.\w+)+)$/
        },
        /*
         *[
         *    {
         *        _id: ObjectId,
         *        ret: String,
         *        score: Number,
         *        time: Number
         *    }
         *]
         */
        questions: {
            "type": Array
        },
        remark: {
            "type": String,
            "default": ""
        },
        sha1: {
            "type": String
        },
        visited: {
            "type": Boolean,
            "default": false
        }
    });

exports.User = User;
exports.Question = Question;
