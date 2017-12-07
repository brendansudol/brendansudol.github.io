---
layout: default
all_css: true
title: Make payment
permalink: /pay/
---

<h1 class="mb2 h2">Send 💰 to Brendan</h1>
<form class="mb2">
  <input class="field" id="amt" type="number" min="1" max="25000" step="1" placeholder="$10" required>
  <button class="btn" type="submit">Pay with card</button>
</form>
<p id="status"></p>

<script src="https://checkout.stripe.com/checkout.js"></script>

<script src="https://code.jquery.com/jquery-1.11.3.min.js"></script>

<script>
(function(){

var amount;

var handler = StripeCheckout.configure({
    key: 'pk_yd93bdlk1BALmCP6PZqjQrKSKDuLo',
    name: 'Brendan Sudol',
    image: 'https://pbs.twimg.com/profile_images/619362003690385408/3fxFf_OJ_400x400.png',
    locale: 'auto',
    token: function(token) {
        $('#status').text('Processing payment...');

        var url = 'https://paybren.herokuapp.com/charge';
        var data = {
            amount: amount,
            token_id: token.id,
            email: token.email
        };

        $.post(url, data, function(res) {
            $('#status').text('Payment received. Thank you!');
        });
    }
});

$('form').on('submit', function(e) {
    e.preventDefault();

    amount = parseFloat($('#amt').val());
    amount = isNaN(amount) ? 100 : Math.round(amount * 100);

    handler.open({
        description: '',
        amount: amount
    });
});

$(window).on('popstate', function() {
    handler.close();
});

/* ping heroku serve to wake it up */
$.get('https://paybren.herokuapp.com');

})();
</script>
