/*
 * @name:db.js
 * @description:CRUD implements
 * @author:wondger@gmail.com
 * @date:2012-07-08
 * @param:
 * @todo:
 * @changelog:
 */
var mongoose = require('mongoose'),
    _ = require('underscore'),
    schema = require('./schema'),
    userSchema = schema.User,
    questionSchema = schema.Question,
    dbName = 'fetest';

var DB = {
        /*
         * create a document
         */
        put: function(collection, doc, callback) {
            if(!_.isString(collection) || !_.isObject(doc) || _.isFunction(doc)){
                return false;
            }

            var callback = _.isFunction(callback) ? callback : function(){};

            var config = DB.config(collection);
            
            if(!config.collection || !config.schema) return false;

            var Mod = config.connection.model(collection, config.schema, config.collection),
                mod = new Mod();

            var _doc = doc;

            _.extend(mod, doc);

            mod.save(function(err, doc){
                callback({
                    success: !err,
                    _id: doc._id
                });
            });
        },
        /*
         * get documents
         */
        get: function(collection, query, options, callback) {
            if(!_.isString(collection) || !_.isObject(query) || _.isFunction(query)){
                return false;
            }

            var callback = _.isFunction(callback) ? callback : (_.isFunction(options) ? options : function(){}),
                options = _.isFunction(options) ? {} : (_.isObject(options) ? options : {});

            var config = DB.config(collection);

            if(!config.collection || !config.schema) return false;

            var Mod = config.connection.model(config.collection, config.schema, config.collection);

            Mod.find(query, null, options, function(err, docs){
                callback({
                    success: !err,
                    docs: docs
                });
            });
        },
        /*
         * modify document
         */
        post: function(collection, query, doc, callback) {
            if(!_.isString(collection) || !_.isObject(doc) || _.isFunction(doc)){
                return false;
            }

            var callback = _.isFunction(callback) ? callback : function(){};

            var config = DB.config(collection);
            
            if(!config.collection || !config.schema) return false;

            var Mod = config.connection.model(collection, config.schema, config.collection);

            Mod.update(query, doc, function(err, numAffected){
                callback({
                    success: !err,
                    numAffected: err ? 0 : numAffected
                });
            });
        },
        /*
         * delete document
         */
        del: function(collection, query, callback) {
            if(!_.isString(collection) || !_.isObject(query) || _.isFunction(query)){
                return false;
            }

            var callback = _.isFunction(callback) ? callback : function(){};

            DB.post(collection, query, {deleted: true}, function(d){
                callback({
                    success: d.success
                });
            });
        },
        del4ever: function(collection, query, callback) {
            if(!_.isString(collection) || !_.isObject(query) || _.isFunction(query)){
                return false;
            }

            var callback = _.isFunction(callback) ? callback : function(){};

            var config = DB.config(collection);
            
            if(!config.collection || !config.schema) return false;

            var Mod = config.connection.model(collection, config.schema, config.collection);

            Mod.remove(query, function(err){
                callback({
                    success: !err
                });
            });
        },
        /*
         * config db connection
         */
        config: function(collection) {
            if (!_.isString(collection)) return {};

            var cfg = {};

            switch(collection){
                case 'user':
                    cfg = {
                        collection: "user",
                        schema: userSchema
                    };
                    break;
                case 'question':
                    cfg = {
                        collection: "question",
                        schema: questionSchema
                    };
                    break;
                default:
                    break;
            }

            cfg.connection = mongoose.createConnection('mongodb://localhost/' + dbName)

            return cfg;
        }
    },

    user = {
        put: function(doc, callback) {
            DB.put("user", doc, function(u){
                if (!u.success) {
                    callback(u);
                    return;
                }

                question.get({}, function(q){
                    if (!q.success) {
                        callback(q);
                        return;
                    }

                    var questions = [];

                    q.docs.forEach(function(doc){
                        questions.push({_id: doc._id});
                    });

                    user.post({
                        _id: u._id
                    }, {
                        questions: questions
                    }, function(d){
                        callback(d);
                    });
                });

            });
        },
        get: function(query, options, callback) {
            return DB.get("user", query, options, callback);
        },
        post: function(query, doc, callback) {
            return DB.post("user", query, doc, callback);
        },
        del: function(query, callback) {
            return DB.del("user", query, callback);
        },
        del4ever: function(query, callback) {
            return DB.del4ever("user", query, callback);
        }
    },

    question = {
        put: function(doc, callback) {
            return DB.put("question", doc, callback);
        },
        get: function(query, options, callback) {
            return DB.get("question", query, options, callback);
        },
        post: function(query, doc, callback) {
            return DB.post("question", query, doc, callback);
        },
        del: function(query, callback) {
            return DB.del("question", query, callback);
        },
        del4ever: function(query, callback) {
            return DB.del4ever("question", query, callback);
        }
    };

// exports
exports.User = user;
exports.Question = question;
