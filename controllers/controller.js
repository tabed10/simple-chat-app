var User = require('./../models/Users.js');

module.exports.new = function(request, response){
    response.render('landingpage.ejs');
}

module.exports.create =  function(request, response){
  var new_user = new User(request.body);
  new_user.save(function(err,data){
    if(err){
      console.log(err)
      return response.status(400).json({error: "Add Name"});
      console.log(data);
    }
    console.log(data);
    return response.status(200).json({message: "User Added"});
  })
  console.log(request.body);


}
module.exports.list = function(request, response) {
  User.find(function(err, data){
    if(err){
      response.status(400)
        .json({
          error: "Database query error"
        });
    }
    response.status(200).json({
      user: data
    });
  });
}
