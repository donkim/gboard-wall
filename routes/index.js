'use strict';

const secret = require('../secret_heroku');
const express = require('express');
const router = express.Router();

var tweet_texts = {};

router.get('/', (req, res) => {
  var Twitter = require('twitter');
  var client = new Twitter({
    consumer_key: secret.consumer_key,
    consumer_secret: secret.consumer_secret,
    access_token_key: secret.access_token_key,
    access_token_secret: secret.access_token_secret
  });
  var query = req.query.q || 'gboard';
  var lang = req.query.lang || '';
  var params = {
    q: query,
    count: 100,
    result_type: 'recent',
    lang: lang
  };
  client.get('search/tweets', params, function(error, tweets, response) {
    if (!error) {
      if (Object.keys(tweet_texts).length > 200) {
        tweet_texts = {};
      }
      
      var new_tweets = [];
      for (var i = 0; i < tweets.length; i++) {
        if (tweets[i].text in tweet_texts) {
          continue;
        }
        
        tweet_texts[tweets[i].text] = 1;
        new_tweets.push(tweets[i]);
      }
      res.render('index', {
        title: 'Tweets - Gboard',
        tweets: new_tweets
      });
    } else {
      res.status(403).send(error).end();
    }
  });
});

module.exports = router;
