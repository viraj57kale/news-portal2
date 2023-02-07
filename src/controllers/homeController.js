const { fetchLatestNews } = require('../services/newsService');
const { fetchAllCategory } = require('../services/categoryService');
const { getLatestNewsCache, setLatestNewsCache } = require('../cache/newsCache');
const { getCategoriesCache, setCategoriesCache } = require('../cache/categoryCache');
// home is not returning approved news only

module.exports.getHomePage = async (req, res) => {
    const latestNewsCache = await getLatestNewsCache();
    const categoriesCache = await getCategoriesCache();

    try {
        if (latestNewsCache && categoriesCache) {
            res.status(200).render('home', { news: latestNewsCache, categories: categoriesCache });
        }

        const categories = await fetchAllCategory();
        const news = await fetchLatestNews();

        await setLatestNewsCache(news);
        await setCategoriesCache(categories);
        
        res.status(200).render('home', { news: news, categories: categories });
    } catch (error) {
        console.log(error);
        res.send(error)
    }
};