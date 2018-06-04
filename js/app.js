$(function() {
  var registerEventListeners = function() {
    deck.click(function(e) {
      var target = $(e.target);
      var id = target.attr("id");
      var elClass = target.attr("class");

      console.log("Click: " + id + " " + target.attr("class"));

      if (elClass === "card-back") {
        target.toggleClass("rotate-card-back");
        target.next(".card-front").toggleClass("rotate-card-front");
      }
    });
  };

  var newCardId = function(n) {
    return "card-" + (n < 10 ? "0" : "") + n.toString();
  };

  var emojiList['em-8ball', 'em-alien', 'em-apple', 'em-avocado',
    'em-bacon', 'em-bear', 'em-bee', 'em-beer', 'em-beetle',
    'em-birthday', 'em-bomb', 'em-brain', 'em-burrito', 'em-cactus',
    'em-candy', 'em-cat', 'em-doughnut', 'em-eagle', 'em-fire',
    'em-flushed', 'em-fox_face', 'em-ghost', 'em-grinning', 'em-hankey',
    'em-heart_eyes', 'em-jack_o_lantern', 'em-joy', 'em-kiss',
    'em-monkey_face', 'em-mushroom', 'em-palm_tree', 'em-pizza'];

  var deck = $(".card-deck");
  var card = $("#card-template .rotate-container");
  var newCard;



  for (var i = 0; i < 4; i++) {
    newCard = card.clone();
    newCard.find(".card-back").prop("id", newCardId(i));
    newCard.appendTo(deck);
  }

  registerEventListeners();
});
