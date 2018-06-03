$(function() {
  $(".card").click(function() {
    console.log("Click!");
    $(".card-back").toggleClass("rotate-card-back");
    $(".card-front").toggleClass("rotate-card-front");
  })
});
