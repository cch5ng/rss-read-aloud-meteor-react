//startup.js
if (Meteor.isServer) {
	Meteor.startup(function() {
		var nprFeedsAr = [];

		//helper function
		function buildFeedObj() {
			var feedObj = {};

		}

		//helper function
		function getNprFeeds() {
			var url = 'http://www.npr.org/rss/rss.php?id=1001';
			var result = HTTP.call("GET", url, function(error, result) {
				if (!error) {
					nprFeedsAr = [];
	//this part works
					console.log('type of: ' + typeof result.content);

					$ = cheerio.load(result.content, {
						normalizeWhitespace: true,
						xmlMode: true
					});
					var prefix = 'npr';

					//case collection is empty
					if (!Nprfeeds.findOne()) {
						$('item').each(function(idx, element) {
								var feedObj = {};
								var feedId;
								// feedObj.pubDate = $(this).find('pubDate').text();
								feedObj.insertOrder = idx;
								//console.log('insertOrder: ' + feedObj.insertOrder);
								feedObj.link = $(this).find('link').text();//.contents();
								feedObj._id = prefix + feedObj.link;
								//console.log('id: ' + feedObj._id);
								//console.log('type of id: ' + typeof feedObj._id);
								feedObj.title = $(this).find('title').text();//.contents();
								//console.log('title: ' + feedObj.title);
								feedObj.description = $(this).find('description').text();//.contents();
								//console.log('description: ' + feedObj.description);
								nprFeedsAr.push(feedObj);

								//insert each feed to collection
								Nprfeeds.insert(feedObj, function(er, id) {
									console.log('id: ' + id);
									if (!er) {
										console.log('insert');
										console.log('size NprFeeds collection: ' + Nprfeeds.find().count());
									} else {
										console.log('error: ' + er);
									}
								});

						});
					} else {
					//case collection is populated
						var newFeedsCount;
						var newFeedsAr = [];
						var counter = 0;
						//for each feed check if its id has match in collection
							//if true, skip
							//if false, add to newFeedsAr
						//iterate over newFeedsAr
							//update the record in collection in order by insertOrder
							//this is assuming that older stories are cycled out by age
						$('item').each(function(idx, element) {
							var feedObj = {};
							feedObj.link = $(this).find('link').text();//.contents();
							feedObj._id = prefix + feedObj.link;

							//if (!Nprfeeds.findOne(feedObj._id)) {
								feedObj.insertOrder = counter;
								feedObj.title = $(this).find('title').text();//.contents();
								feedObj.description = $(this).find('description').text();//.contents();
								newFeedsAr.push(feedObj);
								counter++;
							//}
						});
						console.log('length newFeedsAr: ' + newFeedsAr.length);

						//update the oldest collection items with the new feeds
						newFeedsAr.forEach(function(feed) {
							Nprfeeds.remove({insertOrder: feed.insertOrder});
							Nprfeeds.insert({
								_id: feed._id,
								insertOrder: feed.insertOrder,
								link: feed.link,
								title: feed.title,
								description: feed.description
							});
							console.log('update a feed');
						});
					} //end else

					console.log('length nprFeedsAr: ' + nprFeedsAr.length);
					console.log('size NprFeeds collection: ' + Nprfeeds.find().count());
				} else {
					console.log('error: ' + error);
				}
			});
		}

		getNprFeeds();

		Meteor.setInterval(function() {
			getNprFeeds();
			//Session.set('nprFeedsAr', nprFeedsAr);
		}, 1000 * 60 * 15); //1000 * 60 * 15
	});
}