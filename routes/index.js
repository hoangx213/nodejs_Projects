
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.redirect('/login');
};

exports.newuser = function(req, res){
    res.render('newuser', {title : 'Register'});
};

exports.adduser = function(db){
    return function(req, res){
        var username = req.body.username;
        var password = req.body.password;

        var collection = db.get('chatuser');
        collection.insert({
            "username" : username,
            "password" : password
        }, function(err, doc){
            if(err){
                res.send('Fail adding new user');
            } else {
                res.location('login');
                res.redirect('/login');
            }
        });
    }
};

exports.login = function(req, res){
    res.render('login', {title : 'Login'});
};

exports.trylogin = function(db){
    return function(req, res){
        var username = req.body.username;
        var password = req.body.password;

        var collection = db.get('chatuser');
        collection.find({username : username, password : password}, function(err, docs){
            if(!err && docs.length==1){
                req.session.user_id = username + "_id";
                res.location('chat');
                res.redirect('/chat');
            } else {
                res.send(404, 'Login fail');
            }
        });
    };
};

exports.chat = function(req, res){
    res.render('chat', {title : 'Chat'});
};

exports.logout = function(req, res){
    delete req.session.user_id;
    res.redirect('/login');
}