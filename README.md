# RSS Plus (Meteor/React)

## (in works) Application to read or listen to rss news feed headlines. (Meteor/React)
* http://chc_rss_plus.meteor.com/

## Package Dependencies
* twbs:bootstrap
* react
* fortawesome:fontawesome
* http
* mrt:cheerio
* ecwyne:voice-elements
* webapp
* browser-policy
* accounts-ui
* accounts-password
* accounts-github

## Known Issues
* Audio playback works once for the current feeds on the page.
* To replay feeds which have been previously loaded, the browser needs to be restarted.
* To play feeds which are loaded after audio has played (to the end of the page), the browser needs to be restarted.
  * I apologize and am working on a fix for this.

## Caveat
* Audio playback is only supported on Chrome currently.