/*
 * @name: routes.js
 * @description: 
 * @author: wondger@gmail.com
 * @date: 2012-09-19
 * @param: 
 * @todo: 
 * @changelog: 
 */
var _ = require("underscore"),
    DB = require("./db"),
    sha1 = require("./sha1");

var question = {
        put: function(req, res) {
            var doc = _.pick(req.body, "level", "skill", "content", "time", "remark");

            if (!doc.level || !doc.skill || !doc.content || !doc.content.replace(/^\s+/, '').replace(/\s+$/, '')) {
                res.json({
                    success: false,
                    message: "PARAM ERR"
                });
                return;
            }

            doc.created = new Date();

            DB.Question.put(doc, function(d){
                res.json({
                    success: d && d.success,
                    _id: d._id
                })
            });
        },
        post: function(req, res) {
        },
        get: function(req, res) {
            var query = _.pick(req.body, "id");

            query.deleted = false;

            DB.Question.get(query, function(d){
                var docs = [];
                if (d.docs) {
                    d.docs.forEach(function(doc){
                        docs.push({
                            id: doc._id,
                            content: doc.content,
                            created: doc.created,
                            author: doc.author,
                            time: doc.time,
                            type: doc.type,
                            level: doc.level,
                            skill: doc.skill
                        });
                    });
                }

                res.json({
                    success: d.success,
                    docs: docs
                });
            });
        },
        del: function(req, res) {
        }
    },
    user = {
        get: function(req, res) {
            var query = _.pick(req.body, "_id", "email", "sha1");

            DB.User.get(query, function(d){
                res.json(d);
            });
        }
    },
    test = {
        get: function(req, res, callback) {
            var sha1 = req.params[0].replace(/^(?:(?:\/io)?\/test\/)(.+)$/, "$1"),
                query = {};

            if (sha1) {
                query.sha1 = sha1;
                DB.User.post(query, {visited: true}, function(d){
                });
            }

            DB.User.get(query, function(d){
                if (!d.success || !d.docs.length) {
                    callback ? callback(d) : res.json(d);
                    return;
                }
                
                var _id = d.docs[0]._id,
                    questions = {
                        _ids: [],
                        answers: {} 
                    };

                d.docs[0].questions.forEach(function(question){
                    questions._ids.push(question._id);
                    questions.answers[question._id] = question.answer || "";
                });

                DB.Question.get({
                    _id: {$in: questions._ids}
                }, function(d){
                    var docs = [];
                    if (d.docs) {
                        d.docs.forEach(function(doc){
                            docs.push({
                                _id: doc._id,
                                content: doc.content,
                                created: doc.created,
                                author: doc.author,
                                time: doc.time,
                                type: doc.type,
                                level: doc.level,
                                skill: doc.skill,
                                answer: questions.answers[doc._id]
                            });
                        });
                    }

                    d._id = _id;
                    d.docs = docs;
                    callback ? callback(d) : res.json(d);
                });
            });
        },
        post: function(req, res) {
            var query = _.pick(req.body, "_id"),
                questions;
            DB.User.get(query, function(d){
                if (!d.success || !d.docs.length || !d.docs[0].questions || !d.docs[0].questions.length) {
                    res.json({
                        success: false,
                        message: "TEST NOT EXSITED"
                    });
                    return;
                }
                else {
                    var questions = d.docs[0].questions;
                    questions.forEach(function(d, i){
                        questions[i].answer = req.body[d._id] || "";
                    })

                    DB.User.post(query, {questions: questions}, function(d){
                        res.json(d);
                    });
                }
            });
        }
    };

exports.index = function(req, res) {
    var email = req.body.email || '',
        hash;

    if (!email) {
        res.render("email", {
            title: "FETest",
            email: ''
        });
    }
    else {
        DB.User.get({
            email: email
        }, function(d){
            if (d.success && d.docs.length) {
                if (d.docs[0].visited) {
                    res.render("link", {
                        title: "FETest",
                        link: "/test/" + d.docs[0].sha1,
                        text: "继续挑战"
                    });
                }
                else {
                    res.render("link", {
                        title: "FETest",
                        link: '/test/' + d.docs[0].sha1,
                        text: d.docs[0].sha1
                    });
                }
            }
            else {
                hash = sha1(email + new Date());
                DB.User.put({
                    email: email,
                    sha1: hash
                }, function(d){
                    res.render("link", {
                        title: "FETest",
                        link: '/test/' + hash,
                        text: hash
                    });
                });
            }
        })
    }
};

exports.test = function(req, res) {
    test.get(req, res, function(d){
        res.render("test", {
            title: "challenge!",
            error: d.success && d.docs.length ? "" : "no test!",
            questions: d.docs,
            _id: d._id
        });
    });
};

exports.question = function(req, res) {
    res.render("question", {
        title: "question"
    });
};

exports.io = {
    question: question,
    user: user,
    test: test
};

exports.notfound = function(req, res) {
    res.render("404", {
        title: "FETest"
    });
};
