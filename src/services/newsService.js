const { News } = require('../models/news');

module.exports.createNews =  async (news) => {
    const newNews = new News(news);
    return await newNews.save();
};

module.exports.fetchNewsById = async (newsId) => {
    return await News.findOne({ _id: newsId })
};

module.exports.fetchAllNews = async () => {
    return News.find();
}

// module.exports.fetchPartialResult = async (arg) => {
//     return await News.aggregate()
//                      .search({
//                         index: "searchNews",
//                         text: {
//                             query: arg,
//                             path: ["header", "newsText"],
//                             fuzzy: {}
//                         }
//                      })
// }

module.exports.fetchPartialResult = async (arg) => {
    return await News.aggregate()
                     .search({
                        index: "searchNews",
                        compound: {
                            mustNot: {
                                equals: {
                                    "path": "approval.status",
                                    "value": false
                                },
                            },
                            must: {
                                text: {
                                    query: arg,
                                    path: ["header", "newsText"],
                                    fuzzy: {}
                                }
                            },

                        },

                     });
}

module.exports.updateNewsCommentsById = async (commentId, newsId) => {
    return await News.updateOne({
        _id: newsId
    },{
        $push: {
            comments: commentId
        }
    });
};

module.exports.updateNewsApprovalById = async (newsId, adminId) => {
    return await News.updateOne({
        _id: newsId
    },{
        $set: {
            "approval.status": true,
            "approval.adminId": adminId
        }
    });
};



