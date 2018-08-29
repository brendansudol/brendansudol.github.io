---
layout: post
title: Classify emotions with Tensorflow.js
date: 2018-08-29
---

I finally got around to exploring Tensorflow.js, a JavaScript library for
training and deploying machine learning models in the browser. The toy project
I'm starting with is an image related task -- given a photo, classify the
emotions of the people in it. Why this idea? When I'm on large video calls at
work, there's a grid view that shows everyone on the call and I've often wished
there was a way to quickly gauge how many people were happy / engaged at
periodic times during the meeting. Now I can do that :)

![Example](/assets/img/writing/emotions.png){: .my3.border }

[https://brendansudol.com/faces/](https://brendansudol.com/faces/)

Here's a brief rundown of the key components of this project:

#### Image Prep

After uploading an photo but before it's usable by the ML models, there are some
preparatory steps. The image has to be converted to a `Tensor` of the
appropriate shape and structure -- i.e., normalizing pixel values from [0, 255]
to [-1, 1] and resizing dimensions to match the model parameters. In my case, I
also had to convert color photos to grayscale (because the emotion model was
trained on black and white images). These helper functions can be found
[here](https://github.com/brendansudol/faces/blob/master/src/ml/img.js).

#### Face detection

Before we can determine emotions, we have to find the people / faces in the
image. For this, I'm utilizing
[face-api.js](https://github.com/justadudewhohacks/face-api.js), a library built
on top of Tensorflow.js for face detection / recognition. The library has a few
models to choose from (i.e., SSD Mobilenet, Tiny Yolo); after some
experimentation, I went with MTCNN (Multi-task Cascaded Convolutional Neural
Networks). See
[this paper](https://kpzhang93.github.io/MTCNN_face_detection_alignment/paper/spl.pdf)
for more details; my very lightweight wrapper around this `face-api` model and
utilities is
[here](https://github.com/brendansudol/faces/blob/master/src/ml/face.js).

#### Emotion classification

Now it's time for the primary activity -- classifying emotions. For this, I'm
using an
[open-sourced CNN model](https://github.com/oarriaga/face_classification)
trained on the FER-2013 dataset, which contains images of faces categorized by
one of seven emotional states (Angry, Disgust, Fear, Happy, Sad, Surprise,
Neutral). This model was built in Python, so I used this nifty
[tfjs-converter](https://github.com/tensorflow/tfjs-converter) tool to convert
the Keras model to a web-friendly format. The code for that is
[here](https://github.com/brendansudol/faces/tree/master/py).

#### Wiring up front-end

Finally, the site is wired up with React (main component
[here](https://github.com/brendansudol/faces/blob/master/src/components/App.js)).
And for drawing the boxes around the faces and adding emojis to the image, I'm
using an overlaid `<canvas>` element; one thing to note: the canvas must be
cleared and redrawn if the image dimensions ever change (i.e., if you resize
your browser window).

That's about it. Check it out and let me know what you think!

[https://brendansudol.com/faces/](https://brendansudol.com/faces/)

😄😐🙁
