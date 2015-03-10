package es.unizar.tmdad.lab0.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.social.twitter.api.Stream;
import org.springframework.social.twitter.api.StreamListener;
import org.springframework.social.twitter.api.Twitter;
import org.springframework.social.twitter.api.impl.TwitterTemplate;
import org.springframework.stereotype.Service;

import es.unizar.tmdad.lab0.controller.SimpleStreamListener;

@Service
public class TwitterLookupService {

	private static final int MAX_OPENED_STREAMS = 10;
	@Autowired
	private SimpMessageSendingOperations template;
	private static Map<String, Stream> queries = new HashMap<String, Stream>();

	@Value("${twitter.consumerKey}")
	private String consumerKey;

	@Value("${twitter.consumerSecret}")
	private String consumerSecret;

	@Value("${twitter.accessToken}")
	private String accessToken;

	@Value("${twitter.accessTokenSecret}")
	private String accessTokenSecret;

	public void search(String query) {
		if(!queries.containsValue(query)){
			if(queries.size() >= MAX_OPENED_STREAMS){
				String key = queries.keySet().iterator().next();
				queries.get(key).close();
				queries.remove(key);
			}
			Twitter twitter = new TwitterTemplate(consumerKey, consumerSecret, accessToken, accessTokenSecret);
			List<StreamListener> listeners = new ArrayList<StreamListener>();
			listeners.add(new SimpleStreamListener(template, query));
			Stream stream = twitter.streamingOperations().filter(query, listeners);
			queries.put(query, stream);
		}
	}
}
