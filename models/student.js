var mongoose = require("mongoose");

var studentSchema = new mongoose.Schema({
	name:String,
	image:String,
	school:String,
	mobile:Number,
	altnumber:Number,
	description:String,
	courses:[String],
	teachers:[{
		type:mongoose.Schema.Types.ObjectId,
		ref:'Teacher'
	}]
});

module.exports = mongoose.model("Student",studentSchema);