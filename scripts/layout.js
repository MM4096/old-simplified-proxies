function getWindowSize() {
	return {
		width: window.innerWidth,
		height: window.innerHeight
	};
}

const tabIds = ["add-card-container", "card-list-container", "card-preview-container", "options-bar"]
function showTab(id) {
	const winSize = getWindowSize();
	if (winSize.width <= 768) {

		let selectedIndex = -1
		for (let i = 0; i < tabIds.length; i++) {
			let tabId = tabIds[i];
			if (tabId === id) {
				$(`#${tabId}`).show();
				$(`#tab-index-${i}`).addClass("tab-active");
				selectedIndex = i;
			} else {
				$(`#${tabId}`).hide();
				$(`#tab-index-${i}`).removeClass("tab-active");
			}
		}

		if (selectedIndex !== -1) {

		}
	}
	else {
		for (let i = 0; i < tabIds.length; i++) {
			let tabId = tabIds[i];
			if (tabId === id) {
				$(`#${tabId}`).show();
			}
		}
	}
}

$(document).ready(function () {
	for (let i = 0; i < tabIds.length; i++) {
		$(`#tab-index-${i}`).on("click", function () {
			showTab(tabIds[i]);
		})
	}
	showTab("add-card-container");
})

$("#delete-save").on("click", function (event) {
	document.getElementById("confirm-delete-save").showModal()
})

$("#confirm-delete-save-cancel").on("click", function (event) {
	document.getElementById("confirm-delete-save").close()
})

$("#confirm-delete-save-yes").on("click", function (event) {
	cards = [];
	newEditingCard = null;
	clearInputs();
	saveCards();
	setEditingCardIndex(-1);
	updateCardList();

	document.getElementById("confirm-delete-save").close()
})

$(".print-proxies").on("click", function (event) {
	printProxies();
})

$("#credits").on("click", function (event) {
	document.getElementById("credits-box").showModal()
})