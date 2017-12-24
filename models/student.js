var mongoose = require("mongoose");

var studentSchema = new mongoose.Schema({
	name:String,
	image:String,
	school:String,
	description:String,
	courses:[String],
	teachers:[{
		type:mongoose.Schema.Types.ObjectId,
		ref:'Teacher'
	}]
});

module.exports = mongoose.model("Student",studentSchema);