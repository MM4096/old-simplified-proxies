class Card {
	constructor(name = "", manaCost = "", type = "", text = "", power = "", toughness = "", flavorText = "", notes = "", quantity = 1,
				reverseName = "", reverseManaCost = "", reverseType = "", reverseText = "", reversePower = "", reverseToughness = "") {
		this.name = name;
		this.manaCost = manaCost;
		this.type = type;
		this.text = text;
		this.power = power;
		this.toughness = toughness;
		this.flavorText = flavorText;
		this.notes = notes;
		this.quantity = quantity;

		this.reverseName = reverseName;
		this.reverseManaCost = reverseManaCost;
		this.reverseType = reverseType;
		this.reverseText = reverseText;
		this.reversePower = reversePower;
		this.reverseToughness = reverseToughness;
	}

	toString() {
		return `Card(${this.name}, ${this.manaCost}, ${this.type}, ${this.text}, ${this.power}, ${this.toughness}, ${this.flavorText}, ${this.notes}, ${this.quantity}, ${this.reverseName}, ${this.reverseManaCost}, ${this.reverseType}, ${this.reverseText}, ${this.reversePower}, ${this.reverseToughness})`;
	}

	isEmpty() {
		return this.name === "" && this.manaCost === "" && this.type === "" && this.text === "" && this.power === "" && this.toughness === "" && this.flavorText === "" && this.notes === "" && this.reverseName === "" && this.reverseManaCost === "" && this.reverseType === "" && this.reverseText === "" && this.reversePower === "" && this.reverseToughness === "";
	}

	toJson() {
		return {
			name: this.name,
			manaCost: this.manaCost,
			type: this.type,
			text: this.text,
			power: this.power,
			toughness: this.toughness,
			flavorText: this.flavorText,
			notes: this.notes,
			quantity: this.quantity,
			reverseName: this.reverseName,
			reverseManaCost: this.reverseManaCost,
			reverseType: this.reverseType,
			reverseText: this.reverseText,
			reversePower: this.reversePower,
			reverseToughness: this.reverseToughness,
		}
	}

	fromJson(json) {
		this.name = json.name;
		this.manaCost = json.manaCost;
		this.type = json.type;
		this.text = json.text;
		this.power = json.power;
		this.toughness = json.toughness;
		this.flavorText = json.flavorText;
		this.notes = json.notes;
		this.quantity = json.quantity;
		this.reverseName = json.reverseName;
		this.reverseManaCost = json.reverseManaCost;
		this.reverseType = json.reverseType;
		this.reverseText = json.reverseText;
		this.reversePower = json.reversePower;
		this.reverseToughness = json.reverseToughness;
	}
}

let templateCard = new Card("Preview Card", "{1}{w}{u}{b}{r}{g}{2u}{wp}", "Card Type", "Card Text which supports icon shorthands like \\{t} ({t}) and mana (green) \\{g} ({g}). Phyrexian Mana can be written as color-p (i.e. \\{wp} is phyrexian white {wp}). Dual mana is colorA-colorB (i.e. \\{wu} is white-blue {wu}). Only the \"proper\" dual mana combinations are supported (wu is valid, but uw is not). X costs are \\{x} ({x}), numbers between 0 and 20 are supported (\\{0}: {0}, \\{20}: {20}). 2-or-color is 2-color (i.e. \\{2w} is {2w}). Double Phyrexian mana symbols follow the format first-second-p (i.e. \\{wbp} is {wbp}). Untap is \\{q} ({q}).\n\nDon't want to print color icons? Select \"Use black and white icons\" on the left!", "Power", "Toughness", "Flavor text that doesn't support icons", "Notes can go here", 1);
let cards = []
let newEditingCard = null;
let editingIndex = -1;


$(document).ready(function () {
	loadCards();
	setEditingCardIndex(-1)
	updateCardList();
})

function convertOracleTextToHTML(oracleText, useBlackWhiteIcons = false, useSmallIcons = false) {
	let iconText = convertStringToIconObject(oracleText, useBlackWhiteIcons, useSmallIcons);
	iconText = iconText.replace(/\n/g, "<br><span class=\"line-break\"></span>");
	return iconText;
}

function createCardHTML(card, useBlackWhiteIcons = false, id = "") {
	let powerToughnessText = "";
	if (card.power) {
		if (card.toughness) {
			powerToughnessText = `${card.power} / ${card.toughness}`
		} else {
			powerToughnessText = card.power;
		}
	}

	let usesReverseFace = card.reverseName || card.reverseManaCost || card.reverseType || card.reverseText || card.reversePower || card.reverseToughness;
	let reverseFace = "";
	if (usesReverseFace) {
		let reversePowerToughnessText = "";
		if (card.reversePower) {
			if (card.reverseToughness) {
				reversePowerToughnessText = `${card.reversePower} / ${card.reverseToughness}`
			} else {
				reversePowerToughnessText = card.reversePower;
			}
		}
		reverseFace = `
<div class="card-divider"></div>
<div class="card-reverse">
<div class="card-title-container">
	<h1 class="reverse-card-title">${card.reverseName || ""}</h1>
	<div class="reverse-card-mana-cost">${getIconObject(card.reverseManaCost || "", useBlackWhiteIcons, false)}</div>
</div>
<div class="card-divider p-0 m-0"></div>
<p class="reverse-card-type-line">${card.reverseType || ""}</p>
<div class="card-divider p-0 m-0"></div>
<div class="reverse-card-oracle-text card-oracle-text">${convertOracleTextToHTML(card.reverseText || "", useBlackWhiteIcons, true)}</div>
<div class="grow"></div>
<div class="card-bottom-container">
<p class="grow"></p>
		${reversePowerToughnessText !== "" ? `<p class="card-power-toughness">${reversePowerToughnessText}</p>` : ""}
</div>
</div>`
	}

	return `
<div class="card-container" id="${id}">
	<div class="card-title-container">
		<h1 class="card-title">${card.name || ""}</h1>
		<div class="card-mana-cost">${getIconObject(card.manaCost || "", useBlackWhiteIcons, false)}</div>
	</div>
	<div class="card-divider p-0 m-0"></div>
	
	<p class="card-type-line">${card.type || ""}</p>
	<div class="card-divider p-0 m-0"></div>
	<div class="card-oracle-text">${convertOracleTextToHTML(card.text || "", useBlackWhiteIcons, true)}</div>
	<div style="margin-bottom: 0.2in;"></div>
	<p><i class="card-flavor-text">${card.flavorText || ""}</i></p>
	<div class="grow"></div>
	<div class="card-bottom-container">
		<p class="card-notes">${card.notes || ""}</p>
		${powerToughnessText !== "" ? `<p class="card-power-toughness">${powerToughnessText}</p>` : ""}
	</div>
	${reverseFace}
</div>
`;
}

function saveCards() {
	let json = JSON.stringify(cards.map(card => card.toJson()));
	localStorage.setItem("mtg-cards", json);
}

function loadCards() {
	let json = localStorage.getItem("mtg-cards");
	if (json) {
		json = JSON.parse(json)
		for (let i = 0; i < json.length; i++) {
			let card = new Card();
			card.fromJson(json[i]);
			cards.push(card);
		}
	} else {
		cards = [];
	}
}

function clearInputs() {
	$("#card-name").val("");
	$("#mana-cost").val("");
	$("#type-line").val("");
	$("#oracle-text").val("");
	$("#power").val("");
	$("#toughness").val("");
	$("#flavor-text").val("");
	$("#notes").val("");
	$("#reverse-card-name").val("");
	$("#reverse-mana-cost").val("");
	$("#reverse-type-line").val("");
	$("#reverse-oracle-text").val("");
	$("#reverse-power").val("");
	$("#reverse-toughness").val("");
}

function setPreview(card) {
	let useColorIcon = !$("#use-black-white-icons").is(":checked");

	$("#card-preview").remove();
	$("#card-preview-container").append(createCardHTML(card, useColorIcon, "card-preview"));
}

function getInputCard() {
	return new Card(
		$("#card-name").val(),
		$("#mana-cost").val(),
		$("#type-line").val(),
		$("#oracle-text").val(),
		$("#power").val(),
		$("#toughness").val(),
		$("#flavor-text").val(),
		$("#notes").val(),
		1,
		$("#reverse-card-name").val(),
		$("#reverse-mana-cost").val(),
		$("#reverse-type-line").val(),
		$("#reverse-oracle-text").val(),
		$("#reverse-power").val(),
		$("#reverse-toughness").val()
	)
}

function loadCardIntoInput(card) {
	$("#card-name").val(card.name);
	$("#mana-cost").val(card.manaCost);
	$("#type-line").val(card.type);
	$("#oracle-text").val(card.text);
	$("#power").val(card.power);
	$("#toughness").val(card.toughness);
	$("#flavor-text").val(card.flavorText);
	$("#notes").val(card.notes);
	$("#reverse-card-name").val(card.reverseName);
	$("#reverse-mana-cost").val(card.reverseManaCost);
	$("#reverse-type-line").val(card.reverseType);
	$("#reverse-oracle-text").val(card.reverseText);
	$("#reverse-power").val(card.reversePower);
	$("#reverse-toughness").val(card.reverseToughness);
}

function setEditingCardIndex(index) {
	if (index < 0) {
		if (newEditingCard) {
			loadCardIntoInput(newEditingCard);
		} else {
			setPreview(templateCard);
		}
		$("#cancel-button").hide();
		$("#add-card").text("Add Card");
	} else {
		loadCardIntoInput(cards[index]);
		$("#cancel-button").show();
		$("#add-card").text("Update Card");
	}

	editingIndex = index;
	updatePreviewCard();
}

function updatePreviewCard() {
	if (getInputCard().isEmpty()) {
		setPreview(templateCard);
		return
	}
	setPreview(getInputCard());
}

function updateCardList() {
	let cardList = $("#card-list");
	cardList.empty();
	if (cards.length === 0) {
		cardList.append("<p>No cards added</p>")
		return;
	}

	for (let i = 0; i < cards.length; i++) {
		let thisCard = cards[i];

		let cardName = thisCard.name;
		if (thisCard.reverseName) {
			cardName = `${thisCard.name} // ${thisCard.reverseName}`
		}

		cardList.append(`
<div class="p-3 rounded-md border hover:bg-gray-200 flex flex-row items-center card-list-item" id="card-list-item-${i}">
<span class="grow">${cardName}</span>
<div class="divider divider-horizontal p-0 m-0"></div>
<span class="italic">Qty:</span>
<input type="number" class="input input-ghost p-0 input-sm m-0 max-w-1/5 card-list-qty-input" value="${thisCard.quantity}"/>
</div>`)

		$(`#card-list-item-${i} > .card-list-qty-input`).on("change", function (event) {
			let newQty = $(this).val();
			if (newQty <= 0) {
				cards.splice(i, 1);
				setEditingCardIndex(-1);
			} else {
				cards[i].quantity = newQty;
			}
			updateCardList();
		})

		$(`#card-list-item-${i}`).on("click", function () {
			setEditingCardIndex(i);
			showTab("add-card-container");
		})
	}
}

function printProxies() {
	let printCardsHtml = "";
	// Don't know why this doesn't work normally, so I inverted it
	let useBlackWhiteIcons = !$("#use-black-white-icons").is(":checked");

	for (let i = 0; i < cards.length; i++) {
		let thisCard = cards[i];
		for (let j = 0; j < thisCard.quantity; j++) {
			printCardsHtml += createCardHTML(thisCard, useBlackWhiteIcons, `card-proxy-${thisCard.name}-${j}`);
		}
	}

	let printWin = window.open("", "_blank");
	printWin.document.write(`
<!DOCTYPE html><html lang="en"><head><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Print Proxies</title><link rel="stylesheet" href="styles/mtg.css"/><link rel="stylesheet" href="styles/print.css"/></head>
<body class="">
<div class="no-print">
<button onclick="window.print();">Print</button>
<button onclick="window.close();">Close</button>
<br>
<p style="margin: 0;"><small><i>Want to export as a PDF? Select "Print" then "Save as PDF" as the location!</i></small></p>
</div>
<div class="card-print">
${printCardsHtml}
</div>
</body></html>
`);
	printWin.document.close();

	printWin.onload = function () {
		printWin.focus();
		// printWin.print();
		// printWin.close();
	}
}

function showError(errorText) {
	$("#error-message").text(errorText);
	document.getElementById("error-box").showModal();
}

function scryfallResultToCardObject(scryfallResult) {
	let card = new Card();

	let faceData = [scryfallResult]
	if (scryfallResult.hasOwnProperty("card_faces")) {
		faceData = scryfallResult.card_faces;
	}

	let setNormalInputs = true
	for (let i = 0; i < faceData.length; i++) {
		let thisData = faceData[i];
		if (setNormalInputs) {
			setNormalInputs = false
			card.name = thisData.name;
			card.type = thisData["type_line"] || "";
			card.text = thisData["oracle_text"] || "";
			card.flavorText = thisData["flavor_text"] || "";
			card.manaCost = thisData["mana_cost"] || "";
			card.power = thisData["power"] || "";
			card.toughness = thisData["toughness"] || "";

			if (thisData.hasOwnProperty("loyalty")) {
				card.power = thisData["loyalty"];
			}
		} else {
			card.reverseName = thisData.name;
			card.reverseManaCost = thisData["mana_cost"] || "";
			card.reverseType = thisData["type_line"] || "";
			card.reverseText = thisData["oracle_text"] || "";
			card.reversePower = thisData["power"] || "";
			card.reverseToughness = thisData["toughness"] || "";

			if (thisData.hasOwnProperty("loyalty")) {
				card.reversePower = thisData["loyalty"];
			}
		}
	}
	return card;
}

$("input").on("keyup", function (event) {
	updatePreviewCard();
})

$("textarea").on("keyup", function (event) {
	updatePreviewCard();
})

$("#use-black-white-icons").on("change", function (event) {
	updatePreviewCard();
})

$("#add-card").on("click", function (event) {
	if (getInputCard().name === "") {
		return;
	}
	if (editingIndex < 0) {
		cards.push(getInputCard());
		newEditingCard = null;
		setEditingCardIndex(-1)
	} else {
		cards[editingIndex] = getInputCard();
	}
	updateCardList();
	saveCards();
})

$("#cancel-button").on("click", function (event) {
	setEditingCardIndex(-1);
	updatePreviewCard();
})

$("#use-scryfall-search").on("click", function (event) {
	let useScryfallSearch = $("#use-scryfall-search").is(":checked");
	if (useScryfallSearch) {
		$("#scryfall-search-results").attr("hidden", false);
	} else {
		$("#scryfall-search-results").attr("hidden", true);
	}
})


let isSearching = false;
$("#card-name").on("keyup", function (event) {
	if (event.key !== "Enter") {
		return;
	}
	let useScryfallSearch = $("#use-scryfall-search").is(":checked");
	let cardName = $("#card-name").val();
	let errorTextLabel = $("#scryfall-result-error")

	errorTextLabel.text("");

	if (useScryfallSearch && !isSearching && cardName !== "") {
		isSearching = true;
		fetch(`https://api.scryfall.com/cards/named?exact=${cardName}`).then((result) => {
			result.json().then((json) => {
				if (json.status && json.status !== 200) {
					if (json.status === 404) {
						errorTextLabel.text(`Card not Found`);
					} else {
						errorTextLabel.text(`Error: ${json.status} ${json.details}`);
					}
				} else {
					let faceData = [json]
					if (json.hasOwnProperty("card_faces")) {
						faceData = json.card_faces;
					}

					clearInputs();

					let setNormalInputs = true
					for (let i = 0; i < faceData.length; i++) {
						let thisData = faceData[i];
						if (setNormalInputs) {
							setNormalInputs = false
							$("#card-name").val(thisData.name);
							$("#type-line").val(thisData["type_line"]);
							$("#oracle-text").val(thisData["oracle_text"]);
							$("#flavor-text").val(thisData["flavor_text"] || "");
							$("#mana-cost").val(thisData["mana_cost"] || "");
							$("#power").val(thisData["power"] || "");
							$("#toughness").val(json["toughness"] || "");
							$("#notes").val(json["notes"] || "");

							if (json.hasOwnProperty("loyalty")) {
								$("#power").val(json["loyalty"]);
							}
						} else {
							$("#reverse-card-name").val(thisData.name);
							$("#reverse-mana-cost").val(thisData["mana_cost"] || "");
							$("#reverse-type-line").val(thisData["type_line"]);
							$("#reverse-oracle-text").val(thisData["oracle_text"]);
							$("#reverse-power").val(thisData["power"] || "");
							$("#reverse-toughness").val(json["toughness"] || "");

							if (json.hasOwnProperty("loyalty")) {
								$("#reverse-power").val(json["loyalty"]);
							}

						}
					}

					setEditingCardIndex(-1);
					updatePreviewCard();
					updateCardList();
					saveCards();
				}
			})
		}).catch((e) => {

		}).finally(() => {
			isSearching = false;
		})
	}
})

$("#clear-card").on("click", function (event) {
	clearInputs();
	setEditingCardIndex(-1);
	updatePreviewCard();
})

$("#import-cards-yes").on("click", function (event) {
	function toggleImportButton(enabled) {
		if (enabled) {
			$("#import-cards-yes").removeAttr("disabled");
		} else {
			$("#import-cards-yes").attr("disabled", true);
		}
	}

	let lines = $("#import-cards-textarea").val().split("\n");
	let importLabel = $("#import-cards-chunks-label");
	let importCards = [];

	importLabel.text("");
	toggleImportButton(false);
	for (let i = 0; i < lines.length; i++) {
		let line = lines[i];
		if (line.trim() === "") {
			continue;
		}
		line = line.trim();

		let parts = line.split(" ")
		if (parts.length === 1) {
			// just card
			importCards.push({
				name: parts[0],
				quantity: 1
			})
		} else {
			let amount = parts[0].replaceAll("x", "")
			let number = parseInt(amount);

			if (isNaN(number)) {
				showError(`Invalid card amount "${amount}" for card "${parts[1]}"`);
				toggleImportButton(true);
				return;
			}
			parts.shift();
			let line = parts.join(" ");
			importCards.push({
				name: line,
				quantity: number
			})
		}
	}

	let chunks = [];
	let originalNames = []
	for (let i = 0; i < importCards.length; i += 75) {
		let theseCards = importCards.slice(i, i + 75);
		chunks.push({
			identifiers:
				theseCards.map(card => {
					return {
						name: card.name
					}
				})
		})
		originalNames.push(theseCards)
	}

	let completedRequests = 0;
	let earlyExit = false;
	let tempCards = [];

	importLabel.text(`Importing ${chunks.length} chunks...`);

	for (let i = 0; i < chunks.length; i++) {
		let thisChunk = chunks[i];
		fetch(`https://api.scryfall.com/cards/collection`, {
			headers: {
				"Content-Type": "application/json"
			},
			method: "POST",
			body: JSON.stringify(thisChunk)
		}).then((result) => {
			result.json().then((json) => {
				if (earlyExit) {
					return;
				}

				if (json.status && json.status !== 200) {
					importLabel.text(`Chunk ${i + 1} of ${chunks.length} failed!`)
					showError(`Error: ${json.status} ${json.details}`);
					toggleImportButton(true);
					earlyExit = true;
				} else {
					if (json["not_found"].length > 0) {
						importLabel.text(`Chunk ${i + 1} of ${chunks.length} failed!`)
						showError(`Cards not found: ${json["not_found"].join(", ")}`);
						toggleImportButton(true);
						earlyExit = true;
						return;
					}
					completedRequests++;
					importLabel.text(`Chunk ${i + 1} of ${chunks.length} completed. (${completedRequests}/${chunks.length} total)`)

					let thisChunkOriginalNames = originalNames[i];
					for (let i = 0; i < json.data.length; i++) {
						let thisCard = json.data[i];
						let thisCardObject = scryfallResultToCardObject(thisCard);
						thisCardObject.quantity = thisChunkOriginalNames[i].quantity;
						tempCards.push(thisCardObject);
					}

					if (completedRequests === chunks.length) {
						cards = tempCards;
						updateCardList();
						saveCards();
						toggleImportButton(true);
						document.getElementById("import-cards-box").close();
						$("#import-cards-textarea").val("");
					}
				}
			})
		}).catch((e) => {
			showError(`Error: ${e}`);
			toggleImportButton(true);
			earlyExit = true;
		})
	}
})

$("#preview-all-proxies").on("click", function (event) {
	let container = $("#preview-all-cards-container");
	let useBlackWhiteIcons = !$("#use-black-white-icons").is(":checked");
	container.empty();
	for (let i = 0; i < cards.length; i++) {
		let thisCard = cards[i];
		for (let j = 0; j < thisCard.quantity; j++) {
			let thisHTML = createCardHTML(thisCard, useBlackWhiteIcons, `card-proxy-${thisCard.name}-${j}`);
			container.append(thisHTML);
		}
	}

	document.getElementById("preview-all-cards-box").showModal();
})