//startup.js

Meteor.startup(function() {
// 	getUrl: function(url) {
		var url = 'http://www.npr.org/rss/rss.php?id=1001';
		var result = HTTP.call("GET", url, function(error, result) {
			if (!error) {
//this part works
				//console.log('result content: ' + result.content);
				console.log('type of: ' + typeof result.content);
				//console.log('size NprFeeds collection: ' + NprFeeds.find().count());

				$ = cheerio.load(result.content, {
				    normalizeWhitespace: true,
				    xmlMode: true
				});
				//console.log($);
				//var feeds = $('item');
				//console.log('length feeds: ' + feeds.length);
				var nprFeedsAr = [];
				var prefix = 'npr';

				$('item').each(function(idx, element) {
					//setTimeout(function() {
						var feedObj = {};
						var feedId;
	         			feedObj.link = $(this).find('link').text();//.contents();
						feedObj._id = prefix + feedObj.link;
						console.log('id: ' + feedObj._id);
						console.log('type of id: ' + typeof feedObj._id);
	        			feedObj.title = $(this).find('title').text();//.contents();
	        			console.log('title: ' + feedObj.title);
	         			feedObj.description = $(this).find('description').text();//.contents();
	         			console.log('description: ' + feedObj.description);
	         			//feedObj.pubDate = $(this).find('pubDate').contents();
	         			//console.log('pubDate: ' + feedObj.pubDate);
	         			//console.log('link: ' + feedObj.link);
	         			//var feedId = NprFeeds.insert(feedObj);
	         			console.log('feedObj: ' + feedObj);
	         			//nprFeedsAr.push(feedObj);
	         			//verify that the feed is new
	         			if (!Nprfeeds.find(feedObj._id)) {
		         			Nprfeeds.insert(feedObj, function(er, id) {
		         				console.log('id: ' + id);
		         				if (!er) {
									console.log('insert');
									console.log('size NprFeeds collection: ' + Nprfeeds.find().count());
		         				} else {
		         					console.log('error: ' + er);
		         				}
							});
	         			}

					//}, 0);
				});
				console.log('length nprFeedsAr: ' + nprFeedsAr.length);
				console.log('size NprFeeds collection: ' + Nprfeeds.find().count());

				// for (var i = 0; i < nprFeedsAr.length; i++) {
				 	// var feedId = Nprfeeds.insert(nprFeedsAr[0], function(er, id) {
				 	// 	if (!er) {
					 // 		console.log('insert');
					 // 		console.log('size NprFeeds collection: ' + Nprfeeds.find().count());
				 	// 	} else {
				 	// 		console.log('err insert: ' + er);
				 	// 	}
				 	// });
				// }


			} else {
				console.log('error: ' + error);
			}
		});
//this part does not seem to have any results on client side
// 		return result.content; //result;
// 	}
});