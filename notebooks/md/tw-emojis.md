title: "tw-emojis"

{% highlight python %}
import json
import os

from collections import defaultdict
from time import time

from emoji import UNICODE_EMOJI
from IPython.core.display import display, HTML
from tweepy import OAuthHandler, Stream, StreamListener, API as TwApi

from util.misc import CARTOGRAM, SKIN_TONES, STATE_LOOKUP, STATES
from util.tfidf import tfidf
{% endhighlight %}


{% highlight python %}
CONSUMER_KEY = os.environ.get('TW_CONSUMER_KEY')
CONSUMER_SECRET = os.environ.get('TW_CONSUMER_SECRET')
ACCESS_TOKEN_KEY = os.environ.get('TW_ACCESS_TOKEN_KEY')
ACCESS_TOKEN_SECRET = os.environ.get('TW_ACCESS_TOKEN_SECRET')

DATA_DIR = 'data'
USA_BBOX = [-175.1, 22.4, -59.8, 72.3]  # via http://boundingbox.klokantech.com/
{% endhighlight %}


{% highlight python %}
# a few helper functions

def extract_emojis(txt):
    return [c for c in txt if c in UNICODE_EMOJI]

def sort_values(data):
    return sorted(data.items(), key=lambda x: x[1], reverse=True)

def get_json(fname):
    with open('{}/{}'.format(DATA_DIR, fname)) as f:
        return json.load(f)
    
def save_to_json(data, fname):
    with open('{}/{}'.format(DATA_DIR, fname), 'w') as f:
        json.dump(data, f, ensure_ascii=False)
{% endhighlight %}

**step 1: fetch tweets (within USA)**


{% highlight python %}
# this uses Twitter's streaming API
# for demo purposes, this only fetches 1k tweets
# (in reality, this ran over several days and collected millions of tweets)

class MyListener(StreamListener):
    def __init__(self):
        super().__init__()
        self.ct = 0
        self.started = time()

    def on_status(self, data):
        if hasattr(data, 'retweeted_status'):
            return

        try:
            with open('{}/tweets-all.json'.format(DATA_DIR), 'a') as f:
                f.write('{}\n'.format(json.dumps(data._json)))
        except Exception as e:
            print('error: {}'.format(str(e)))

        self.ct += 1
        if (self.ct % 100 == 0):
            print('🚨 {} tweets... ({} secs elapsed)'.format(
                self.ct,
                int((time() - self.started))
            ))

        # stop stream after 1k results (for demo)
        if self.ct > 1000:
            return False
            
    def on_error(self, status):
        print('uh-oh! ({})'.format(status))
{% endhighlight %}


{% highlight python %}
auth = OAuthHandler(CONSUMER_KEY, CONSUMER_SECRET)
auth.set_access_token(ACCESS_TOKEN_KEY, ACCESS_TOKEN_SECRET)
api = TwApi(auth)

stream = Stream(auth, MyListener())
stream.filter(locations=USA_BBOX)
{% endhighlight %}

    🚨 100 tweets... (4 secs elapsed)
    🚨 200 tweets... (8 secs elapsed)
    🚨 300 tweets... (13 secs elapsed)
    🚨 400 tweets... (17 secs elapsed)
    🚨 500 tweets... (21 secs elapsed)
    🚨 600 tweets... (26 secs elapsed)
    🚨 700 tweets... (29 secs elapsed)
    🚨 800 tweets... (34 secs elapsed)
    🚨 900 tweets... (38 secs elapsed)
    🚨 1000 tweets... (42 secs elapsed)


**step 2: filter tweets to ones containing emojis**


{% highlight python %}
filtered = []

with open('{}/tweets-all.json'.format(DATA_DIR)) as f:
    for i, line in enumerate(f):
        d = json.loads(line)
        emojis = extract_emojis(d['text'])

        if i % 200000 == 0:
            print('done with {}...'.format(i))

        if not len(emojis):
            continue

        filtered.append({
            'id': d['id_str'],
            'time': d['created_at'],
            'user': d['user']['screen_name'],
            'text': d['text'],
            'coordinates': d['coordinates'],
            'place': d['place'],
            'emojis': emojis,
            'emojis_names': [UNICODE_EMOJI[e] for e in emojis],
        })

print('{} tweets with emojis'.format(len(filtered)))
{% endhighlight %}

    done with 0...
    done with 200000...
    done with 400000...
    done with 600000...
    done with 800000...
    done with 1000000...
    done with 1200000...
    done with 1400000...
    done with 1600000...
    done with 1800000...
    413433 tweets with emojis



{% highlight python %}
save_to_json(filtered, 'tweets-w-emojis.json')
{% endhighlight %}

**step 3: aggregate by emoji and state**


{% highlight python %}
data = get_json('tweets-w-emojis.json')

data[0]
{% endhighlight %}




    {'coordinates': None,
     'emojis': ['👀', '😏'],
     'emojis_names': [':eyes:', ':smirking_face:'],
     'id': '866461716569350145',
     'place': {'attributes': {},
      'bounding_box': {'coordinates': [[[-85.605166, 30.355644],
         [-85.605166, 35.000771],
         [-80.742567, 35.000771],
         [-80.742567, 30.355644]]],
       'type': 'Polygon'},
      'country': 'United States',
      'country_code': 'US',
      'full_name': 'Georgia, USA',
      'id': '7142eb97ae21e839',
      'name': 'Georgia',
      'place_type': 'admin',
      'url': 'https://api.twitter.com/1.1/geo/id/7142eb97ae21e839.json'},
     'text': "I'm here for Drake and Vanessa... Dranessa 👀😏",
     'time': 'Mon May 22 01:12:25 +0000 2017',
     'user': 'LongLiveDenzy'}




{% highlight python %}
state_cts, emoji_cts = defaultdict(int), defaultdict(int)
state_emoji_cts = defaultdict(lambda: defaultdict(int))

for d in data:
    place = d['place']

    if not place:
        continue

    country, ptype = place['country_code'], place['place_type']
    if country != 'US' or ptype not in ['city', 'admin']:
        continue

    state = place['name']
    if ptype == 'city':
        state = STATE_LOOKUP[place['full_name'][-2:].upper()]

    if state not in STATES:
        continue

    state_cts[state] += 1
    for e in d['emojis_names']:
        if e not in SKIN_TONES:
            emoji_cts[e] += 1
            state_emoji_cts[state][e] += 1
{% endhighlight %}


{% highlight python %}
sort_values(state_cts)[:10]
{% endhighlight %}




    [('Texas', 55023),
     ('California', 48004),
     ('Florida', 26849),
     ('New York', 20858),
     ('Ohio', 18172),
     ('Georgia', 17905),
     ('Illinois', 13705),
     ('Louisiana', 13586),
     ('North Carolina', 11725),
     ('Pennsylvania', 10869)]




{% highlight python %}
sort_values(emoji_cts)[:10]
{% endhighlight %}




    [(':face_with_tears_of_joy:', 133771),
     (':loudly_crying_face:', 47571),
     (':red_heart:', 30301),
     (':smiling_face_with_heart-eyes:', 28715),
     (':fire:', 18188),
     (':female_sign:', 17195),
     (':weary_face:', 15559),
     (':skull:', 13885),
     (':face_with_rolling_eyes:', 13747),
     (':person_shrugging:', 12666)]




{% highlight python %}
# show most popular emojis by state 

results = []

for state, emojis in sorted(state_emoji_cts.items()):
    results.append({
        'state': state,
        'emojis': dict(emojis),
        'top_emojis': sort_values(emojis)[:10],
    })

for r in results[:5]:
    print('{}:\n{}'.format(r['state'], r['top_emojis'][:3]))
{% endhighlight %}

    Alabama:
    [(':face_with_tears_of_joy:', 2882), (':loudly_crying_face:', 590), (':female_sign:', 498)]
    Alaska:
    [(':face_with_tears_of_joy:', 80), (':red_heart:', 50), (':loudly_crying_face:', 33)]
    Arizona:
    [(':face_with_tears_of_joy:', 1985), (':loudly_crying_face:', 745), (':red_heart:', 718)]
    Arkansas:
    [(':face_with_tears_of_joy:', 958), (':fire:', 258), (':red_heart:', 221)]
    California:
    [(':face_with_tears_of_joy:', 13933), (':loudly_crying_face:', 5584), (':red_heart:', 4001)]



{% highlight python %}
save_to_json(results, 'emojis-by-state.json')
{% endhighlight %}

**step 4: add tf-idf (term frequency–inverse document frequency)**


{% highlight python %}
data = get_json('emojis-by-state.json')
counts_list = [d['emojis'] for d in data]

data_tfidf = []

for d in data:    
    counts = d['emojis']
    scores = {word: tfidf(word, counts, counts_list) for word in counts}
    sorted_words = sort_values(scores)

    data_tfidf.append({
        'state': d['state'],
        'top_counts': d['top_emojis'],
        'top_tfidf': sorted_words[:10],
    })
{% endhighlight %}


{% highlight python %}
# preview results

for d in data_tfidf[:5]:
    print('{}:'.format(d['state']))

    for i, result in enumerate(d['top_tfidf'][:3]):
        word, score = result
        print("\t{}. {} tf-idf: {}".format(i + 1, word, round(score, 5)))
{% endhighlight %}

    Alabama:
    	1. :double_exclamation_mark: tf-idf: 0.00104
    	2. :speaking_head: tf-idf: 0.00094
    	3. :cat_face_with_tears_of_joy: tf-idf: 0.00074
    Alaska:
    	1. :snow-capped_mountain: tf-idf: 0.00971
    	2. :mount_fuji: tf-idf: 0.0053
    	3. :passenger_ship: tf-idf: 0.00486
    Arizona:
    	1. :A_button_(blood_type): tf-idf: 0.00311
    	2. :deciduous_tree: tf-idf: 0.00198
    	3. :cactus: tf-idf: 0.00138
    Arkansas:
    	1. :cloud: tf-idf: 0.01442
    	2. :double_exclamation_mark: tf-idf: 0.00209
    	3. :water_wave: tf-idf: 0.00207
    California:
    	1. :heavy_minus_sign: tf-idf: 0.00147
    	2. :thermometer: tf-idf: 0.0009
    	3. :cat_face_with_tears_of_joy: tf-idf: 0.00068


**step 5: combine with state cartogram info**


{% highlight python %}
emoji_stats = { d['state']: d for d in data_tfidf }
data_final = []

for c in CARTOGRAM:
    entry = c.copy()
    entry.update({'stats': emoji_stats[c['name']]})
    data_final.append(entry)

save_to_json(data_final, 'state-stats.json')
{% endhighlight %}
