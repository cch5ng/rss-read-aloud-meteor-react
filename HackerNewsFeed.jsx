//src/js/HackerNewsFeed.jsx

HNApp = React.createClass({
	mixins: [ReactMeteorData],

	getMeteorData() {
		return {
			hnfeeds: Hnfeeds.find({}).fetch() //, {insertOrder: 1} //figure out sort by score?
		};
	},

	renderHnFeeds() {
		return this.data.hnfeeds; 
	},

	render: function() {
		//console.log({this.state.data});
//TODO think timing issue where either HNFeedList or HNFeed is getting rendered before all the 
//api requests have returned

		return (<div className="hn-feeds container">
					<div class="row">
						{/*<button className="btnHackerNews">Play</button>*/}
						<h3 className='h3-hn'>Hacker News Stories {/*this.state.data[0].link ? 'NPR News Feed' : ''*/}</h3>
					</div>
					<FeedList data={this.data.hnfeeds} />
				</div>
		);

	}
})

var Feed = React.createClass({
	render: function() {
		return (
			<div className="col-xs-12 col-sm-6 col-md-4 feed">
				<h3><a href={this.props.link} target="_blank">{this.props.title}</a></h3>
				{/*<p>{this.props.description}</p>*/}
			</div>
			);
	}
});

var FeedList = React.createClass({
	render: function() {
		console.log('props.data: ' + this.props.data);
		var feedNodes = this.props.data.map(function(feed) {
			return (
				<Feed key={feed._id} title={feed.title} link={feed.link} >
				</Feed>
			);
		});

		return (
			<div className="feedList row">
				{feedNodes}
			</div>
		);
	}
});