const mtgImages = ["deflecting-swat", "explore", "jace-the-perfected-mind", "sakura-tribe-elder", "sol-ring"];
const ptcgImages = ["arven", "budew", "gardevoir-ex", "legacy-energy", "tm-evo"];
let currentIndex = Math.floor(Math.random() * mtgImages.length);

function preloadImages() {
	let loadedCounter = 0;
	for (let i = 0; i < ptcgImages.length; i++) {
		let img = new Image();
		let img2 = new Image();
		img.src = "images/index/carousel/ptcg/proxy/" + ptcgImages[i] + ".png";
		img2.src = "images/index/carousel/ptcg/actual/" + ptcgImages[i] + ".png";
		img.onload = function () {
			loadedCounter++;
			if (loadedCounter === ptcgImages.length) {
				setImages();
				startSwitchSequence();
			}
		}
		img2.onload = function () {
			loadedCounter++;
			if (loadedCounter === ptcgImages.length) {
				setImages();
				startSwitchSequence();
			}
		}
	}
	for (let i = 0; i < mtgImages.length; i++) {
		let img = new Image();
		let img2 = new Image();
		img.src = "images/index/carousel/mtg/proxy/" + mtgImages[i] + ".png";
		img2.src = "images/index/carousel/mtg/actual/" + mtgImages[i] + ".png";
		img.onload = function () {
			loadedCounter++;
			if (loadedCounter === mtgImages.length) {
				setImages();
				startSwitchSequence();
			}
		}
		img2.onload = function () {
			loadedCounter++;
			if (loadedCounter === mtgImages.length) {
				setImages();
				startSwitchSequence();
			}
		}
	}
}

$(document).ready(function () {
	// startSwitchSequence();
	preloadImages();
});

$("a").on("mouseenter", function () {
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

function setImages() {
	$("#preview-ptcg .actual").attr("src", "images/index/carousel/ptcg/actual/" + ptcgImages[currentIndex] + ".png").attr("alt", ptcgImages[currentIndex] + "-actual");
	$("#preview-ptcg .proxy").attr("src", "images/index/carousel/ptcg/proxy/" + ptcgImages[currentIndex] + ".png").attr("alt", ptcgImages[currentIndex] + "-proxy");

	$("#preview-mtg .actual").attr("src", "images/index/carousel/mtg/actual/" + mtgImages[currentIndex] + ".png").attr("alt", mtgImages[currentIndex] + "-actual");
	$("#preview-mtg .proxy").attr("src", "images/index/carousel/mtg/proxy/" + mtgImages[currentIndex] + ".png").attr("alt", mtgImages[currentIndex] + "-proxy");
}

function startSwitchSequence() {
	currentIndex = (currentIndex + 1) % ptcgImages.length;

	$(".proxy").addClass("hidden");
	$(".actual").removeClass("hidden");
	setTimeout(function () {
		$(".actual").addClass("hidden");
		$(".proxy").removeClass("hidden");
	}, 3000);


	setTimeout(function () {
		$(".actual").addClass("hidden");
		$(".proxy").addClass("hidden");
		setTimeout(function () {
			setImages();
		}, 750)
	}, 6000);
}

setInterval(function () {
	startSwitchSequence();
}, 7500);