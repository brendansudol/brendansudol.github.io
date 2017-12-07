module.exports = {
  context: __dirname + '/assets/js',
  entry: {
    cleverCounties: './cleverCounties.js',
    colorDots: './colorDots.js',
    countdown: './countdown.js',
    eplStandings: './eplStandings.js',
    googleDots: './googleDots.js',
    letItSnow: './letItSnow.js',
    nyc: './nyc.js',
    responsiveD3: './responsiveD3.js',
    soccerOutcomes: './soccerOutcomes.js',
    statesUnited: './statesUnited.js',
    texturejsDemo: './texturejsDemo.js',
    ttsAnimate: './ttsAnimate',
    usaToScatter: './usaToScatter.js',
    worldCupDraw: './worldCupDraw.js',

    d3: ['d3'],
  },
  output: {
    path: __dirname + '/_site/assets/build',
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
}
