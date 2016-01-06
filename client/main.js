Meteor.startup(function() {
    // var element = document.querySelector('#player'); //('voice-player');
  //TODO how to handle this for multiple feeds
    var counter = 0;
    var feed;
    var feedNodes;
    var feedNodesLength;
    var audioStates = ['playing', 'stopped', 'paused'];
    var audioState = audioStates[1];
    // console.log('audioState: ' + audioState);
    // console.log('element: ' + element);
    // console.log('element inner html' + element.innerHTML);

//setup audio player (web audio api speech synthesis)
    var msg = new SpeechSynthesisUtterance();
    var voices = window.speechSynthesis.getVoices();
//this doesn't seem to have any effect on chrome
    msg.voice = voices[10]; // Note: some voices don't support altering params
    msg.voiceURI = 'native';
    msg.volume = 1; // 0 to 1
    msg.rate = 1; // 0.1 to 10
    msg.pitch = 1; //0 to 2
//    msg.text = 'Hello World';
    msg.lang = 'en-US';


    //added a cancel() call because otherwise the play/speak() was not applying to the first feed item
    //maybe the voice-element state was cached from previous session
  //TODO timing issue, polymer .html files are getting loaded after this file does
    //element.cancel();

    function playNextFeed() {
      feed = feedNodes[counter].querySelector('h3').innerText;
    //       console.log('counter: ' + counter);
      console.log('text: ' + feed);
    //       console.log('audioState: ' + audioState);
      //text += feedNodes[i].querySelector('p').innerHTML;
      //console.log('text: ' + text);

//comment out voice elements calls
      // element.setAttribute('text', feed);
      // element.speak();
      
//set text for speechsynthesis
      msg.text = feed;
      window.speechSynthesis.speak(msg);
      console.log('playing audio');
      audioState = audioStates[0];
    }

  //TODO add handling for the audio resume function
  //if condition for if state is 'stopped' (then play from beginning) vs 'paused' (then resume)
    $('.fa-play').click( function() {
      console.log('clicked play');
      //if audio stopped
      if (audioState === audioStates[1]) {
        feedNodes = document.getElementsByClassName('feed');
        feedNodesLength = feedNodes.length;
        //console.log('feedNodes length: ' + feedNodes.length);
        playNextFeed();
      } else if (audioState === audioStates[2]) {
      //if audio paused
        if (counter > 0) {
          //NOTE resume only resumes feed[0]; but audio does not play through the list
          window.speechSynthesis.resume();

          //element.resume();
          // console.log('counter: ' + counter);
          // console.log('audioState: ' + audioState);
        //NOTE cancel increments counter but makes the audio play through the list
        //element.cancel();
        } else if (counter === 0) {
          playNextFeed();
          // console.log('counter: ' + counter);
          // console.log('audioState: ' + audioState);
        }

        audioState = audioStates[0];

      }

    });

  //TODO click listener for audio Pause button
    $('.fa-pause').click( function() {
      window.speechSynthesis.pause();

      //element.pause();
      audioState = audioStates[2];
      console.log('audioState: ' + audioState);
    });

  //disabled because cancel was giving unpredictable behavior
  //TODO click listener for audio Stop button (audio cancel)
    //$('.fa-stop').click( function() {
      //element.cancel();
      //counter = feedNodesLength - 1;
      //element.setAttribute('text', '');
      //counter = 0;
      //audioState = audioStates[1];
      //console.log('counter: ' + counter);
      //console.log('audioState: ' + audioState);
    //});

  //TODO this event does not currently get triggered
    // element.addEventListener('end', function(e) {
    //   console.log('finished playing one feed');
    //   e.preventDefault();
      //console.log('feedNodesLength - 1: ' + (feedNodesLength - 1).toString());
      //console.log('gets to end of feed num: ' + counter);
      // if (counter < feedNodesLength - 1) {
      //   counter++; 
      //   //console.log('counter: ' + counter);
      //   playNextFeed();
      // } else if (counter === feedNodesLength - 1) {
  //TODO would like to indicate that audio is looping again from the start 
        // element.pause();
        // element.setAttribute('text', 'restarting feed audio');
        // element.resume();
    //     counter = 0;
    //     playNextFeed();
    //     //console.log('counter: ' + counter);
    //   }
    // });


    msg.onend = function(e) {
        console.log('finished playing one feed');
        e.preventDefault();
        if (counter < feedNodesLength - 1) {
            counter++;
            //console.log('counter: ' + counter);
            playNextFeed();
        } else if (counter === feedNodesLength - 1) {
            window.speechSynthesis.pause();
            //comment out cancel because it seems like you cannot resume playing afterward
            //window.speechSynthesis.cancel();

            //msg.text = 'restarting feed audio';
            //window.speechSynthesis.resume();
            counter = 0;
            //playNextFeed();
        }

      //console.log('Finished in ' + event.elapsedTime + ' seconds.');
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