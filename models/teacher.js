var mongoose= require("mongoose");

var teacherSchema=new mongoose.Schema({
	name:String,
	image:String,
	description:String,
	courses:[String]
	
});

module.exports = mongoose.model("Teacher", teacherSchema);