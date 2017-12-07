---
layout:     post
title:      Intro to Isomorphic React
date:       2016-06-02
---

An isomorphic JavaScript app is one that runs the same code on both the server
and client. Maybe not quite as cool as the fancy name may suggest, but it's
still pretty freaking cool, especially when paired with React. In essence, you
can render a React component on the server and ship the HTML down to the client
which then hooks into it and handles any future updates.

There are a number of isomorphic tutorials out there, but they all seemed rather
complicated and overwhelming to me (and included things more relevant to larger
apps, like additional routing and state management libraries). I wanted to make
a simple "hello world" like example of an isomorphic React app. So here goes:

### 0\. Initial set-up

To get started, you should have Node.js installed and have a basic understanding
of using npm and JavaScript modules.

    $ git clone https://github.com/brendansudol/isomorphic-react-demo.git
    $ cd isomorphic-react-demo
    $ npm install

### 1\. The shared, React component:

{% highlight javascript %}
import React from 'react';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {count: 0};
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState({count: this.state.count + 1});
  }

  render() {
    return (
      <div>
        <h1>Hi {this.props.name}!</h1>
        <button onClick={this.handleClick}>
          Clicks: {this.state.count}
        </button>
      </div>
    );
  }
}

export default App
{% endhighlight %}

Nothing fancy here. All this component does is say 'hi' (to a name passed in as
a `prop`) and counts the number of button clicks.

### 2\. The server:

{% highlight javascript %}
import express from 'express';
import React from 'react';
import ReactDOMServer from 'react-dom/server';

import App from './components/App';


let app = express();

app.use(express.static(__dirname + '/static'));
app.set('port', (process.env.PORT || 5000));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  const data = {name: req.query.name || "pal"};
  const content = ReactDOMServer.renderToString(<App {...data} />);

  res.render("index", {
    content: content,
    state: JSON.stringify(data)
  });
});

app.listen(app.get('port'), () => {
  console.log(`Server running on port ${app.get('port')}...`);
});
{% endhighlight %}

And the view (which uses [EJS](http://ejs.co/) for templating):

{% highlight html %}
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <script>
      window.__STATE__ = <%- state %>    
    </script>
  </head>
  <body>
    <div id="app"><%- content %></div>
    <script src="/bundle.js"></script>
  </body>
</html>
{% endhighlight %}

I'm using Express, a minimal and popular Node.js web application framework.

There's only one route. It checks for a `name` URL parameter and passes it to
the React component which gets rendered to a string and shipped down to the view
(and added within `<div id="app">`). Even if a user has JavaScript disabled,
they'll see the UI elements — woohoo!

### 3\. The client:

{% highlight javascript %}
import React from 'react';
import ReactDOM from 'react-dom';

import App from './components/App';


const data = window.__STATE__;
const div = document.getElementById('app');

ReactDOM.render(<App {...data} />, div);
{% endhighlight %}

The client-side JS picks up where the server left off. React notices the
component already on the page and simply attaches event handlers to the relevant
elements and handles future UI changes.

I'm using [Webpack](https://webpack.github.io/) to transpile, bundle, and minify
the client-side code (see
[config](https://github.com/brendansudol/isomorphic-react-demo/blob/master/webpack.config.js)
for more details).

### 4\. Sharing state

One potential thing to keep in mind is sharing the state (i.e., React props)
between the server and client. In this example, we pass the state down into the
view (alongside the React component string), store it as a JavaScript global
variable (`window.__STATE__`), and then consume this variable on the client.

### 5\. Build

    npm start

I added a few
[npm scripts](https://github.com/brendansudol/isomorphic-react-demo/blob/master/package.json#L5)
to kick off the web server (as well as watch for changes and run tests).

After running `npm start` or `npm run serve`, open
[http://localhost:3000/?name=Bob](http://localhost:3000/?name=Bob) and marvel at
your new isomorphic app 😊
