var express 		= require("express"),
	app				= express(),
	ejs				= require("ejs"),
	bodyParser 		= require("body-parser"),
	mongoose		= require("mongoose"),
	passport 		= require("passport"),
	LocalStrategy 	= require("passport-local"),
	flash 			= require ('connect-flash'),
	methodOverride 	= require("method-override"),
	path 			= require('path'),
	Student 		= require("./models/student.js"),
	Teacher 		= require("./models/teacher.js"),
	User 	 		= require("./models/user.js");

mongoose.connect("mongodb://localhost/ExpertEvent");

app.use(express.static(path.join(__dirname,"public")));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
//passport configuration
app.use(require('express-session')({
	secret:"This is a secret password",
	resave:false,
	saveUninitialized:false 
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.set("view engine","ejs");

app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash('error');
	res.locals.success = req.flash("success");
	
	next();
});


app.get("/", function(req,res){
	res.render("landing");
});

app.get("/students", function(req,res){
	var student = Student.find(function(err,student){
		if(err){
			console.log(err);
		}
		else{
			res.render("student",{students:student});
		}
	});
	
});

app.get("/teachers", function(req,res){
	var teacher = Teacher.find(function(err,teacher){
		if(err){
			console.log(err);
		}
		else{
			res.render("teacher",{teachers:teacher});
		}
	});
	
});

app.get("/students/:id/edit",isLoggedIn,function(req,res){
	//is user logged in?
	
		Student.findById(req.params.id, function(err,student){
		
				res.render("student_edit",{student:student});
		
			});
		});

app.get("/teachers/:id/edit",isLoggedIn,function(req,res){
	//is user logged in?
	
		Teacher.findById(req.params.id, function(err,teacher){
		
				res.render("teacher_edit",{teacher:teacher});
		
			});
		});

app.post("/students",function(req,res){
	Student.create(req.body.student,function(err,foundStudent){
		if(err){
			console.log(err);
		}
		else{
			res.redirect("/student");
		}
	});
});

app.post("/teachers",function(req,res){
	Teacher.create(req.body.teacher,function(err,foundTeacher){
		if(err){
			console.log(err);
		}
		else{
			res.redirect("/teachers");
		}
	});
});


app.put("/teachers/:id",function(req,res){
	//find and update the correct campground
	//redirect somewhere
	Teacher.findByIdAndUpdate(req.params.id,req.body.teacher,function(err,updatedog){
		if(err){
			res.redirect('/teachers');
		}else {
			res.redirect("/teachers/"+ req.params.id);
		}
	});

});


app.put("/students/:id",function(req,res){
	//find and update the correct campground
	//redirect somewhere
	Student.findByIdAndUpdate(req.params.id,req.body.student,function(err,updatedog){
		if(err){
			res.redirect('/students');
		}else {
			res.redirect("/students/"+ req.params.id);
		}
	});

});




app.get("/teachers/new",isLoggedIn, function(req,res){
	res.render("teacher_form");
});

app.get("/students/new",isLoggedIn, function(req,res){
	res.render("student_form");
});


app.get("/teachers/:id",function(req,res){
	Teacher.findById(req.params.id,function (err,found){
		if(err){
			console.log(err);
		}
		else{
			res.render("student_detail",{student:found});
		}
	});
});

app.get("/students/:id",function(req,res){
	Student.findById(req.params.id).populate("teacher").exec(function (err,found){
		if(err){
			console.log(err);
		}					
		else{
			res.render("student_detail",{student:found});
		}
	});
});




app.delete("students/:id", function(req,res){
		Student.findByIdAndRemove(req.params.id,function(err){
		res.redirect("/students");
	});
});

app.delete("/teachers/:id",function(req,res){
	Teacher.findByIdAndRemove(req.params.id,function(err){
		res.redirect("/teachers");
	});
});




//====================================================================================
	//AUTHENTICATION ROUTES
//====================================================================================

app.get("/login",function(req,res){
	req.flash("error","you need to login first!");
	res.render("login");
});

app.post('/login',passport.authenticate("local",
{
	successRedirect: '/students',
	failureRedirect: '/login'
}),function(req,res){
	req.flash("success","succesfully logged in!");
});

app.get("/register",function(req,res){
	req.flash("error","you need to login first!");
	res.render("register");
});

app.post('/register',function(req,res){
	User.register(new User({username: req.body.username}),req.body.password,function(err,user){
		if(err){
			console.log(err);
			return res.render('register');
		}
		passport.authenticate("local")(req,res,function(){
			res.redirect("/students");
		});
	});
});


function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		req.flash("success","logged in succesfully");
		return next();
	}
	req.flash("error","You need to Login First");
	res.redirect('/login');
}


app.listen(3000,function(req,res){
	console.log("began listening on port 3000");
});

