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
