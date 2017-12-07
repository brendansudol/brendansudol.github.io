---
layout:     post
title:      The magic words to get free pizza
date:       2015-05-28
---

Another week, another Kaggle competition write-up. I'm officially dubbing this
month _Machine Learning May_. But rest assured, this will be the last one of
these write-ups for a little while — I don't want to get type-casted :)

For this competition, we're tasked with predicting altruism. We're given a
dataset of textual requests for pizza from the Reddit community [Random Acts of
Pizza][reddit]. All requests ask for one thing: a free pizza. Our goal is to
create a model that can predict the success of these requests.

This is a nice intro challenge for people wanting to cut their teeth on some
basic natural language processing (NLP). There's also an accompanying academic
paper by a group of Stanford PhD students [here][paper], which is a fun read and
helpful in seeing how they approached the problem.

This time around, submissions are evaluated based on the area under the ROC
curve. For more info on ROC analysis, [this paper][roc_paper] is a great primer,
but basically it's a way to visualize the performance of a classifier (true
positives vs. false negatives) along various discrimination thresholds (the
cutoff probability for the binary classification).

Alright, time for the models. I ended up doing two. The first is a very simple
Naive Bayes [Bag of Words][bag_words] model using the text from the request
(after combining the title and body fields). The code for it is below and after
some parameter tuning, it scores a 0.605. The second model uses a Gradient
Boosting Classifier and incorporates more features (several of which come from
the academic paper above); this one scores a 0.702 (code [here][model_2_code]).

Curious which individual words best predict whether a request will result in a
pizza? See below!

[reddit]: http://www.reddit.com/r/Random_Acts_Of_Pizza/
[paper]: http://cs.stanford.edu/~althoff/raop-dataset/altruistic_requests_icwsm.pdf
[roc_paper]: https://ccrma.stanford.edu/workshops/mir2009/references/ROCintro.pdf
[bag_words]: http://en.wikipedia.org/wiki/Bag-of-words_model
[model_2_code]: http://nbviewer.ipython.org/github/brendansudol/kaggle-pizza/blob/master/ipy-notebooks/model-2-gradient-boosting.ipynb


{% highlight python %}
import json, re
import pandas as pd
import numpy as np

from nltk.corpus import stopwords
from sklearn.naive_bayes import MultinomialNB
from sklearn.cross_validation import train_test_split
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics import roc_curve, auc
{% endhighlight %}


{% highlight python %}
dfs = {}
for name in ['train', 'test']:
    df = pd.read_json('../data/%s.json' % name)
    df['_data'] = name
    dfs[name] = df

# combine train and test data into one df
df = dfs['train'].append(dfs['test'])
df = df.reset_index(drop=True)

# limit to shared columns (plus predictor)
cols = list(dfs['test'].columns) + ['requester_received_pizza']
df = df[cols]

# rename a few columns to be pithier
df.rename(columns={
        'request_title': 'title', 
        'request_text_edit_aware': 'body',
        'requester_received_pizza': 'got_pizza',
}, inplace=True)

# convert got pizza indicator to ints
df['got_pizza'] = df['got_pizza'].apply(lambda x: -1 if pd.isnull(x) else int(x))

# toss out unused columns
cols_to_keep = ['_data', 'request_id', 'title', 'body', 'got_pizza']
df = df[cols_to_keep]

df.iloc[0]
{% endhighlight %}




    _data                                                     train
    request_id                                             t3_l25d7
    title                   Request Colorado Springs Help Us Please
    body          Hi I am in need of food for my 4 children we a...
    got_pizza                                                     0
    Name: 0, dtype: object




{% highlight python %}
# combine title and body columns
df['txt_raw'] = df['title'] + ' ' + df['body']

# check that it worked
for col in ['title', 'body', 'txt_raw']:
    print df.iloc[0][col]
    print '--'
{% endhighlight %}

    Request Colorado Springs Help Us Please
    --
    Hi I am in need of food for my 4 children we are a military family that has really hit hard times and we have exahusted all means of help just to be able to feed my family and make it through another night is all i ask i know our blessing is coming so whatever u can find in your heart to give is greatly appreciated
    --
    Request Colorado Springs Help Us Please Hi I am in need of food for my 4 children we are a military family that has really hit hard times and we have exahusted all means of help just to be able to feed my family and make it through another night is all i ask i know our blessing is coming so whatever u can find in your heart to give is greatly appreciated
    --



{% highlight python %}
# clean up text (lowercase, letters only, remove stop words)

def clean_txt(raw, remove_stop=False):
    # remove non-letters
    letters_only = re.sub("[^a-zA-Z]", " ", raw) 

    # convert to lower case, split into individual words
    words = letters_only.lower().split()                             

    # remove stop words
    stops = set(stopwords.words("english"))
    words = [w for w in words if not w in stops]
    
    # join cleaned words
    return " ".join(words)

df['txt_clean'] = df['txt_raw'].apply(clean_txt)

# check that it worked
for col in ['txt_raw', 'txt_clean']:
    print df.iloc[0][col]
    print '--'
{% endhighlight %}

    Request Colorado Springs Help Us Please Hi I am in need of food for my 4 children we are a military family that has really hit hard times and we have exahusted all means of help just to be able to feed my family and make it through another night is all i ask i know our blessing is coming so whatever u can find in your heart to give is greatly appreciated
    --
    request colorado springs help us please hi need food children military family really hit hard times exahusted means help able feed family make another night ask know blessing coming whatever u find heart give greatly appreciated
    --



{% highlight python %}
# prep training set data for modeling
# creates numerical arrays for X (bag of words) and y (got pizza)

def get_xy(vectorizer=None, txt_col='txt_clean'):
    if vectorizer is None:
        vectorizer = CountVectorizer()
        
    dg = df[df['_data'] == 'train']

    X = vectorizer.fit_transform(dg[txt_col]).toarray()
    y = dg['got_pizza'].astype(int).as_matrix()

    return X, y
{% endhighlight %}


{% highlight python %}
# randomly split training set and try default NB model

X, y = get_xy()
X_train, X_test, y_train, y_test = train_test_split(X, y, random_state=1234)

model = MultinomialNB().fit(X_train, y_train)

print "Accuracy on training data: %f" % model.score(X_train, y_train)
print "Accuracy on test data:     %f" % model.score(X_test, y_test)

y_pred = model.predict_proba(X_test)[:, 1]
fpr, tpr, thresholds = roc_curve(y_test, y_pred)
print "AUC: %f" % auc(fpr, tpr)
{% endhighlight %}

    Accuracy on training data: 0.885149
    Accuracy on test data:     0.717822
    AUC: 0.512876



{% highlight python %}
#
# whoa, not very good - an roc auc just a little bit better
# than random chance and a big difference in error rates
# between training and test data implying overfitting
#
{% endhighlight %}


{% highlight python %}
# let's calibrate some params (in vectorizer & classifier)
# and choose values that maximize roc auc

# the grid of params to search over
alphas = [1, 5, 10, 25]
min_dfs = [0.001, 0.01, 0.02, 0.05]

# loop through values to find optimal settings
best_alpha, best_min_df = None, None
max_auc = -np.inf

for alpha in alphas:
    for min_df in min_dfs:
        
        vectorizer = CountVectorizer(min_df = min_df)

        X, y = get_xy(vectorizer)
        X_train, X_test, y_train, y_test = train_test_split(X, y, random_state=123)

        model = MultinomialNB(alpha=alpha).fit(X_train, y_train)

        y_pred = model.predict_proba(X_test)[:, 1]        
        fpr, tpr, thresholds = roc_curve(y_test, y_pred)
        auc_val = auc(fpr, tpr)

        if auc_val > max_auc:
            max_auc = auc_val
            best_alpha, best_min_df = alpha, min_df 

                
print "alpha: %f" % best_alpha
print "min_df: %f" % best_min_df
print "best auc: %f" % max_auc
{% endhighlight %}

    alpha: 5.000000
    min_df: 0.020000
    best auc: 0.605254



{% highlight python %}
# let's make sure this new model is less over-fit

vectorizer = CountVectorizer(min_df = best_min_df)

X, y = get_xy(vectorizer)
X_train, X_test, y_train, y_test = train_test_split(X, y, random_state=1234)

model = MultinomialNB(alpha=best_alpha).fit(X_train, y_train)

print "Accuracy on training data: %f" % model.score(X_train, y_train)
print "Accuracy on test data:     %f" % model.score(X_test, y_test)
{% endhighlight %}

    Accuracy on training data: 0.757756
    Accuracy on test data:     0.724752



{% highlight python %}
# finally, let's train on full training set with best params
# and save our predictions for submission

vectorizer = CountVectorizer(min_df = best_min_df)

X, y = get_xy(vectorizer)

model = MultinomialNB(alpha=best_alpha).fit(X, y)

df_test = df[df['_data'] == 'test'].copy()
X_test = vectorizer.transform(df_test['txt_clean'])
y_pred = model.predict_proba(X_test)[:, 1]

df_test['requester_received_pizza'] = y_pred
final_df = df_test[['request_id', 'requester_received_pizza']]

# sanity check entries 
print final_df.head(5)

# output predictions
final_df.to_csv('../output/predicted.csv', index=False)
{% endhighlight %}

         request_id  requester_received_pizza
    4040   t3_i8iy4                  0.325085
    4041  t3_1mfqi0                  0.545561
    4042   t3_lclka                  0.242250
    4043  t3_1jdgdj                  0.167956
    4044   t3_t2qt4                  0.142908



{% highlight python %}
# and for funsies, let's see which words best predict getting a pizza 

words = np.array(vectorizer.get_feature_names())

x = np.eye(X.shape[1])
probs = model.predict_proba(x)[:, 1]

word_df = pd.DataFrame()
word_df['word'] = words
word_df['P(pizza | word)'] = probs
word_df.sort('P(pizza | word)', ascending=False, inplace=True)

print 'good words'
print word_df.head(10)
print '\n---\n'
print 'bad words'
print word_df.tail(10)
{% endhighlight %}

    good words
               word  P(pizza | word)
    161         jpg         0.427790
    268        rice         0.383345
    157       imgur         0.364823
    325       tight         0.363433
    141     helping         0.361993
    235      person         0.354807
    345  unemployed         0.344983
    231    paycheck         0.338030
    233      paying         0.337769
    50        check         0.336646
    
    ---
    
    bad words
             word  P(pizza | word)
    34   birthday         0.181946
    169     leave         0.180133
    104   florida         0.175216
    326      till         0.172488
    112   friends         0.165682
    20       area         0.162599
    108      free         0.159392
    285   sitting         0.159047
    307  studying         0.155792
    111    friend         0.143568

