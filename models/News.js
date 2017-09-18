const mongoose=require('mongoose');

//define mongoose schema
const Schema = mongoose.Schema;

const NewsSchema = new Schema({

	//title string
	title:{
		type: String,
		trim: true,
		required: true
	},
	//subtitle string
	link:{
		type: String,
		trim: true
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

let NewsModel = mongoose.model('News',NewsSchema);

module.exports = NewsModel;