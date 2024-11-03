export const renderHomePage = (req, res) => {
	res.render('layout', {
		title: 'url shortener',
		content: 'content/index',
		shortUrl: null,
		errorMessage: null
	});
};
