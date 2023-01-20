const { News } = require('../models/news');

module.exports.createNews =  async (news) => {
    const newNews = new News(news);
    return await newNews.save();
}

module.exports.fetchNewsById = async (newsId) => {
    return await News.findOne({ _id: newsId })
}

// id -> newsId
module.exports.updateNewsCommentsById = async (commentId, newsId) => {
    return await News.updateOne({
        _id: newsId
    },{
        $push: {
            comments: commentId
        }
    });
};



