//startup.js
if (Meteor.isServer) {
	Meteor.startup(function() {
		var nprFeedsAr = [];
		//nytimes feeds array
		var nytFeedsAr = [];
		//hacker news
		var hnIndexAr = [];
		var hnFeedsAr = [];

		//helper function
		function buildFeedObj() {
			var feedObj = {};

		}

		//helper; need to get list of indices for popular stories, per hacker news api (no traditional rss)
		function getHackerNewsIndices() {
			var url = 'https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty';
			var result = HTTP.call("GET", url, function(error, result) {
				if (!error) {
					//converting string to array
					var tempAr = result.content.split(', ');
					console.log('length tempAr: ' + tempAr.length);
					console.log('type tempAr: ' + typeof tempAr);
					console.log('tempAr[0]: ' + tempAr[0]);
					console.log('tempAr[tempAr.length - 1]: ' + tempAr[tempAr.length - 1]);
					console.log('length tempAr[0]: ' + tempAr[0].length);

					//reformating first and last elements
					tempAr[0] = tempAr[0].slice(2);
					console.log('tempAr[0]: ' + tempAr[0]);
					console.log('length tempAr[0]: ' + tempAr[0].length);

					tempAr[tempAr.length - 1] = tempAr[tempAr.length - 1].slice(0, 8);
					console.log('tempAr[tempAr.length - 1]: ' + tempAr[tempAr.length - 1]);
					console.log('length tempAr[0]: ' + tempAr[0].length);

					//hnIndexAr = result.content;
					for (var i = 0; i < 30; i++) {
						hnIndexAr.push(tempAr[i]);

					}

					//console.log('result: ' + result);
					//console.log('result content: ' + result.content);
					//console.log('type of: ' + typeof result.content);
					//console.log('length content: ' + result.content.length);
					//console.log('type of: ' + typeof result);
					console.log('length hnIndexAr: ' + hnIndexAr.length);
					console.log('hnIndexAr: ' + hnIndexAr);
				} else {
					console.log('error: ' + error);
				}
			});
		}

		function getHackerNewsFeeds() {

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

//TODO abstract this logic with the previous helper
		//helper function
		function getNytFeeds() {
			var url = 'http://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml';
			var result = HTTP.call("GET", url, function(error, result) {
				if (!error) {
					nytFeedsAr = [];
	//this part works
					console.log('type of: ' + typeof result.content);
//TEST see if this prevents confusion between npr and nyt feeds
					//using $1 var to differentiate between that used for npr feed
					$1 = cheerio.load(result.content, {
						normalizeWhitespace: true,
						xmlMode: true
					});
					var prefix = 'nyt';

					//case collection is empty
					if (!Nytfeeds.findOne()) {
						$1('item').each(function(idx, element) {
								var feedObj = {};
								var feedId;
								var descStr,
									descAr = [];
								// feedObj.pubDate = $(this).find('pubDate').text();
								feedObj.insertOrder = idx;
								//console.log('insertOrder: ' + feedObj.insertOrder);
								feedObj.link = $1(this).find('link').text();//.contents();
								feedObj._id = prefix + feedObj.link;
								//console.log('id: ' + feedObj._id);
								//console.log('type of id: ' + typeof feedObj._id);
								feedObj.title = $1(this).find('title').text();//.contents();
								//console.log('title: ' + feedObj.title);
								//separating feed description text from the html used to display ads
								descStr = $1(this).find('description').text();
								descAr = descStr.split('<br clear=');
								feedObj.description = descAr[0];//.contents();
								//console.log('description: ' + feedObj.description);
								nytFeedsAr.push(feedObj);

								//insert each feed to collection
								Nytfeeds.insert(feedObj, function(er, id) {
									console.log('id: ' + id);
									if (!er) {
										console.log('insert');
										console.log('size NytFeeds collection: ' + Nytfeeds.find().count());
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
						$1('item').each(function(idx, element) {
							var feedObj = {};
							feedObj.link = $1(this).find('link').text();//.contents();
							feedObj._id = prefix + feedObj.link;

							feedObj.insertOrder = counter;
							feedObj.title = $1(this).find('title').text();//.contents();
							descStr = $1(this).find('description').text();
							descAr = descStr.split('<br clear=');
							feedObj.description = descAr[0];//.contents();
							newFeedsAr.push(feedObj);
						});
						console.log('length newFeedsAr: ' + newFeedsAr.length);
//TEST fix for update error
						//clear old feeds from collection
						Nytfeeds.remove({}, function() {
							newFeedsAr.forEach(function(feed) {
								Nytfeeds.insert({
									_id: feed._id,
									insertOrder: feed.insertOrder,
									link: feed.link,
									title: feed.title,
									description: feed.description
								});
								console.log('update a feed');
							});
						});
					}

					console.log('length nytFeedsAr: ' + nytFeedsAr.length);
					console.log('size NytFeeds collection: ' + Nytfeeds.find().count());
				} else {
					console.log('error: ' + error);
				}
			});
		}

		getHackerNewsIndices();
		getNprFeeds();
		getNytFeeds();

		Meteor.setInterval(function() {
			getNprFeeds();
			getNytFeeds();
			//Session.set('nprFeedsAr', nprFeedsAr);
		}, 1000 * 60 * 15); //1000 * 60 * 15

//TODO populate collection with hackernews content

	});//end Meteor.startup()
}