const { Category } = require('../models/category');

module.exports.createCategory = async (category) => {
    const newCategory = new Category(category);
    return await newCategory.save();
};

// without transaction -> duplocacy -> for pagination
module.exports.fetchCategoryByName = async (categoryName) => {
    return await Category.findOne({ categoryName: categoryName })
                         .select({ news: 0, __v: 0 }).orFail();
};

// Transaction
module.exports.fetchCategory = async (categoryName, session) => {
    return await Category.findOne({ categoryName: categoryName }, null ,{ session: session })
                         .select({ news: 0, __v: 0 }).orFail()
}

module.exports.fetchCategoriesWithCount = async () => {
    return await Category.find().select({ news: 0, __v: 0, _id: 0 }) //admin category view
}

module.exports.fetchAllCategory = async () => {
    return await Category.find()
                         .select({ news: 0, __v: 0 });
};


module.exports.fetchCategoryNews = async (categoryName, limit, skip) => {
    // accepts limit and skip
    return await Category.findOne({ categoryName: categoryName })
                         .select({ __v: 0 })
                         .populate({
                            path: 'news',
                            match: { "approval.status": true },
                            options: { limit: limit, skip: skip }
                        })
};





// module.exports.updateCategoriesNewsById = async (categoryId, newsId, session) => {
//     return await Category.updateOne({
//         _id: categoryId
//     },{
//         $push: {
//             news: newsId
//         }
//     }, { session: session });
// }

module.exports.updateCategoriesNewsById = async (categoryId, newsId, session) => {
    return await Category.updateOne({
        _id: categoryId
    },{
        $push: {
            news: newsId
        }
    }, { session: session });
}

// module.exports.upd = async (categoryName, newsId, session) => {
//     return await Category.findOneAndUpdate({ categoryName: categoryName})
// }


// Transaction
module.exports.deleteCategoriesNewsById = async (categoryId, newsId) => {
    return await Category.updateOne({
        _id: categoryId
    }, {
        $pull: {
            news: newsId
        }
    });
};



