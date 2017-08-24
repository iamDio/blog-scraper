const mongoose=require('mongoose');

//define mongoose schema
let Schema = mongoose.Schema;

let NoteSchema = new Schema({
	id: {
		type: Number,
		unique: true,
		index: true
	},
	// save bool
	saved:{
		type: Boolean,
		default: false
	},
	//note text string
	note:{
		type: String
	},
	//date saved
	date:{
		type: Date,
		default: Date.now
	}
});

let NoteModel = mongoose.model('Note',NoteSchema);

module.exports = NoteModel;