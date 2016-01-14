var feed;
var feedNodes;
var feedNodesLength;

Meteor.startup(function() {
		var counter = 0;
//TODO maybe change this to a session var, 'isPlaying'
		var audioStates = ['playing', 'stopped', 'paused'];
		var audioState = audioStates[1];
		//Session.set('audioState', 'stopped');

//setup audio player (web audio api speech synthesis)
		var msg = new SpeechSynthesisUtterance();
		var voices = window.speechSynthesis.getVoices();
//this doesn't seem to have any effect on chrome
		msg.voice = voices[10]; // Note: some voices don't support altering params
		msg.voiceURI = 'native';
		msg.volume = 1; // 0 to 1
		msg.rate = 1; // 0.1 to 10
		msg.pitch = 1; //0 to 2
		msg.lang = 'en-US';

		function playNextFeed() {
			feed = feedNodes[counter].querySelector('h3').innerText;
		//       console.log('counter: ' + counter);
//      console.log('text: ' + feed);
		//       console.log('audioState: ' + audioState);

//set text for speechsynthesis
			msg.text = feed;
			window.speechSynthesis.speak(msg);
			// console.log('playing audio');
			Session.set('isPlaying', true);
			audioState = audioStates[0];
		}

	//TODO add handling for the audio resume function
	//if condition for if state is 'stopped' (then play from beginning) vs 'paused' (then resume)
	//need to handle 2 conditions
	//play the entire page
	//resume from where was paused
		$('.fa-play').click( function() {

			console.log('clicked play');
			if (audioState === audioStates[1]) { //Session.get('audioState') === 'stopped')
				//start of session where audio has not played
				//or the entire page of feeds has been played and the audio is paused
				feedNodes = document.getElementsByClassName('feed');
				feedNodesLength = feedNodes.length;
				//console.log('feedNodes length: ' + feedNodes.length);
				playNextFeed();
			} else if (audioState === audioStates[2]) { //if (Session.get('audioState') === 'paused') 
			//audio paused in the middle of the page of feeds
				if (counter > 0) {
					//NOTE resume only resumes feed[0]; but audio does not play through the list
					window.speechSynthesis.resume();

					// console.log('counter: ' + counter);
					// console.log('audioState: ' + audioState);
				//NOTE cancel increments counter but makes the audio play through the list
				//element.cancel();
				} else if (counter === 0) {
					feedNodes = document.getElementsByClassName('feed');
					feedNodesLength = feedNodes.length;
					window.speechSynthesis.resume();
					playNextFeed();
					// console.log('counter: ' + counter);
					// console.log('audioState: ' + audioState);
				}

				//Session.set('audioState', 'playing');
				audioState = audioStates[0];
			}
		});

	//TODO click listener for audio Pause button
		$('.fa-pause').click( function() {
			window.speechSynthesis.pause();
			//Session.set('audioState', 'paused');
			console.log('clicked pause');
			audioState = audioStates[2];
//      console.log('audioState: ' + audioState);
		});

		msg.onend = function(e) {
//        console.log('finished playing one feed');
				e.preventDefault();
				if (counter < feedNodesLength - 1) {
						counter++;
						//console.log('counter: ' + counter);
						playNextFeed();
				} else if (counter === feedNodesLength - 1) {
						window.speechSynthesis.pause();
						audioState = audioStates[2];
						//Session.set('audioState', 'paused');
						counter = 0;
				}
		};


//not sure these necessary
		// element.addEventListener('start', function(e) {
		//   e.preventDefault();
		// });

		// element.addEventListener('pause', function(e) {
		//   e.preventDefault();
		// });

		// element.addEventListener('resume', function(e) {
		//   e.preventDefault();
		// });
});

Template.navbar.events({
//TODO missing the calls for hacker news feeds
	'click .js-refresh-feeds': function(event) {
		console.log('clicked refresh');
		Meteor.call('getNprFeeds', function() {
			Meteor.call('getNytFeeds', function() {
				feedNodes = document.getElementsByClassName('feed');
				feedNodesLength = feedNodes.length;
				console.log('feedNodesLength: ' + feedNodesLength);
			});
		});
	}
});