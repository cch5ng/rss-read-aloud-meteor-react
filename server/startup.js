//startup.js

// Meteor.methods({
// 	getUrl: function(url) {
		var url = 'http://www.npr.org/rss/rss.php?id=1001';
		var nprFeeds = [];
		var result = HTTP.call("GET", url, function(error, result) {
			if (!error) {
//this part works
				//console.log('result content: ' + result.content);
				console.log('type of: ' + typeof result.content);
				$ = cheerio.load(result.content, {
				    normalizeWhitespace: true,
				    xmlMode: true
				});
				//console.log($);
				var feeds = $('item');
				//console.log('length feeds: ' + feeds.length);

				var prefix = 'npr';

				$('item').each(function(idx, element) {
					var feedObj = {};
					feedObj._id = prefix + $(this).find('link').contents();
					console.log('id: ' + feedObj._id);
        			feedObj.title = $(this).find('title').contents();
        			console.log('title: ' + feedObj.title);
         			feedObj.description = $(this).find('description').contents();
         			console.log('description: ' + feedObj.description);
         			feedObj.pubDate = $(this).find('pubDate').contents();
         			console.log('pubDate: ' + feedObj.pubDate);
         			feedObj.link = $(this).find('link').contents();
         			console.log('link: ' + feedObj.link);
         			nprFeeds.push(feedObj);
				});

				console.log('length nprFeeds: ' + nprFeeds.length);

			} else {
				console.log('error: ' + error);
			}
		});
//this part does not seem to have any results on client side
// 		return result.content; //result;
// 	}
// });