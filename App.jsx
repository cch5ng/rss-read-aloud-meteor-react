//App.jsx

App = React.createClass({
	mixins: [ReactMeteorData],

	getMeteorData() {
		return {
			nprfeeds: Nprfeeds.find({}).fetch()
		};
	},

	renderNprFeeds() {
		return this.data.nprfeeds;//.map((nprfeed) => {
			//return <Feed key={nprfeed._id} feed={nprfeed}></Feed>
			//);
		//}) 
	},

	render: function() {
		return (<div className="nprFeed container">
					{/*<button className="btnNpr">Play</button>*/}
					<div className="row">
						<h3 className='h3-npr'>NPR News Feed {/*this.state.data[0].link ? 'NPR News Feed' : ''*/}</h3>
					</div>
					<FeedList data={this.data.nprfeeds} />
				</div>
		);
	}
});

var Feed = React.createClass({
	render: function() {
		return (
			<div className="col-xs-12 col-sm-6 col-md-4 feed">
				<h3><a href={this.props.link} target="_blank">{this.props.title}</a></h3>
				<p>{this.props.description}</p>
				{/*<p>{this.props.pubDate}</p>*/}
			</div>
			);
	}
});

var FeedList = React.createClass({
	render: function() {
		console.log('props.data: ' + this.props.data);
		var feedNodes = this.props.data.map(function(feed) {
			return (
				<Feed key={feed.id} title={feed.title} description={feed.description} pubDate={feed.pubDate} link={feed.link} >
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