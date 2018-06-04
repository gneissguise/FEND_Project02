var CARD_COUNT = 12;

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

  var rando = function(max) {
    return Math.floor(Math.random() * max);
  };

  var insertCard = function(id) {
    var newCard = card.clone();
    newCard.find(".card-back").prop("id", newCardId(id));
    newCard.appendTo(deck);
  };

  var generatePairs = function() {
    var selected[];

    for (var i = 0; i < (CARD_COUNT / 2); i++) {
      var n = rando();

      if (selected.length === 0 || selected.indexOf(emojiList[n]) === -1){
        selected.push(emojiList[n]);
      }
      else {
          while(selected.indexOf(emojiList[n]) > -1) {
            n = rando();
          }
          selected.push(emojiList[n]);
      }
    }

    return selected;
  }

  var emojiList['em-8ball', 'em-alien', 'em-apple', 'em-avocado',
    'em-bacon', 'em-bear', 'em-bee', 'em-beer', 'em-beetle',
    'em-birthday', 'em-bomb', 'em-brain', 'em-burrito', 'em-cactus',
    'em-candy', 'em-cat', 'em-doughnut', 'em-eagle', 'em-fire',
    'em-flushed', 'em-fox_face', 'em-ghost', 'em-grinning', 'em-hankey',
    'em-heart_eyes', 'em-jack_o_lantern', 'em-joy', 'em-kiss',
    'em-monkey_face', 'em-mushroom', 'em-palm_tree', 'em-pizza'];
  var pairs[] = generatePairs();
  var cardList;
  var deck = $(".card-deck");
  var card = $("#card-template .rotate-container");

  for (var i = 0; i < 4; i++) {
    insertCard(i);
  }

  registerEventListeners();
});
