const mongoose = require('mongoose');

const SlideSchema = new mongoose.Schema({
    lang:String,
    author:String,
    searchTerm:String,
    font:String,
    prefix:String,
    sourceContentOriginal:String,
    sourceContentSanitized:String,
    sentences:[{
        text:String,
        keywords:[String],
        images:[String],
        googleSearchTerm:String,
        title:String,
    }],
    downloadedImages:[String]
},{
    timestamps:true,
});

module.exports=mongoose.model('Slide',SlideSchema);