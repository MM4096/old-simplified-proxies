const mtgImages = ["deflecting-swat", "explore", "jace-the-perfected-mind", "sakura-tribe-elder", "sol-ring"]
const ptcgImages = ["arven", "budew", "gardevoir-ex", "legacy-energy", "tm-evo"]
let currentIndex = 0;

$("a").on("mouseenter", function () {
	console.log("mouseenter");
	let id = $(this).attr("id");

	if (id === "ptcg") {
		$("#preview-ptcg").addClass("selected");
	} else if (id === "mtg") {
		$("#preview-mtg").addClass("selected");
	}
});

$("a").on("mouseleave", function () {
	$("#preview-ptcg").removeClass("selected");
	$("#preview-mtg").removeClass("selected");
});

setInterval(function () {

}, 1000)