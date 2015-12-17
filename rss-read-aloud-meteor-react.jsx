//rss-read-aloud-meteor-react.jsx

if (Meteor.isClient) {
  Meteor.startup(function() {
     ReactDOM.render(
//try to set as data instead of url
       <App />,
       document.getElementById('npr')
     );
  });
}