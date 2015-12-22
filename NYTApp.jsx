//App.jsx

NYTApp = React.createClass({
	mixins: [ReactMeteorData],

	getMeteorData() {
		return {
			nytfeeds: Nytfeeds.find({}, {insertOrder: 1}).fetch()
		};
	},

	renderNytFeeds() {
		return this.data.nytfeeds; 
	},

	render: function() {
		return (<div className="nytFeed container">
					{}
					<div className="row">
						<h3 className='h3-nyt'>New York Times News Feed {/*this.state.data[0].link ? 'NPR News Feed' : ''*/}</h3>
					</div>
					<FeedList data={this.data.nytfeeds} />
				</div>
		);
	}
});

//TODO move FeedList and Feed to separate components so they can be reused by other feed sources (hackernews, etc)

var Feed = React.createClass({
	render: function() {
		return (
			<div className="col-xs-12 col-sm-6 col-md-4 feed">
				<h3><a href={this.props.link} target="_blank">{this.props.title}</a></h3>
				<p>{this.props.description}</p>
			</div>
			);
	}
});

var FeedList = React.createClass({
	render: function() {
		console.log('props.data: ' + this.props.data);
		var feedNodes = this.props.data.map(function(feed) {
			return (
				<Feed key={feed._id} title={feed.title} description={feed.description} pubDate={feed.pubDate} link={feed.link} >
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