class Card {
	constructor(name = "", manaCost = "", type = "", text = "", power = "", toughness = "", flavorText = "", notes = "", quantity = 1) {
		this.name = name;
		this.manaCost = manaCost;
		this.type = type;
		this.text = text;
		this.power = power;
		this.toughness = toughness;
		this.flavorText = flavorText;
		this.notes = notes;
		this.quantity = quantity;
	}

	toString() {
		return `Card(${this.name}, ${this.manaCost}, ${this.type}, ${this.text}, ${this.power}, ${this.toughness}, ${this.flavorText}, ${this.notes})`;
	}

	isEmpty() {
		return this.name === "" && this.manaCost === "" && this.type === "" && this.text === "" && this.power === "" && this.toughness === "" && this.flavorText === "" && this.notes === "";
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
			quantity: this.quantity
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
	}
}

let templateCard = new Card("Template Card", "{1}{w}{u}{b}{r}{g}{2u}{wp}", "Card Type", "Card Text which supports icon shorthands like \\{t} ({t}) and mana (green) \\{g} ({g}). Phyrexian Mana can be written as color-p (i.e. \\{wp} is phyrexian white {wp}). Dual mana is colorA-colorB (i.e. \\{wu} is white-blue {wu}). Only the \"proper\" dual mana combinations are supported (wu is valid, but uw is not). X costs are \\{x} ({x}), numbers between 0 and 20 are supported (\\{0}: {0}, \\{20}: {20}). 2-or-color is 2-color (i.e. \\{2w} is {2w}) Untap is \\{q} ({q}).\n\nDon't want to print color icons? Select \"Use black and white icons\" on the left!", "Power", "Toughness", "Flavor text that doesn't support icons", "Notes can go here", 1);
let cards = []
let newEditingCard = null;
let editingIndex = -1;


$(document).ready(function () {
	loadCards();
	setUpdatingCard(-1)
	updateCardList();
})

function saveCards() {
	let json = JSON.stringify(cards.map(card => card.toJson()));
	localStorage.setItem("cards", json);
}

function loadCards() {
	let json = localStorage.getItem("cards");
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

function setPreview(card) {
	let useColorIcon = !$("#use-black-white-icons").is(":checked");

	$("#card-preview-title").text(card.name);

	$("#card-preview-cost").html(getIconObject(card.manaCost, useColorIcon, false));
	$("#card-preview-type-line").text(card.type);


	let formattedText = card.text.replace(/\n/g, "<br>");
	$("#card-preview-oracle-text").html(convertStringToIconObject(formattedText, useColorIcon, true));
	$("#card-preview-flavor-text").text(card.flavorText);

	let card_power_toughness = $("#card-preview-power-toughness");
	if (card.power) {
		card_power_toughness.show()
		if (card.toughness) {
			card_power_toughness.text(`${card.power} / ${card.toughness}`);
		} else {
			card_power_toughness.text(card.power)
		}
	} else {
		card_power_toughness.hide()
	}

	$("#card-preview-notes").text(card.notes);
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
		$("#notes").val()
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
}

function setUpdatingCard(index) {
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
		cardList.append(`
<div class="p-3 rounded-md border hover:bg-gray-200 flex flex-row items-center" id="card-list-item-${i}">
<span class="grow">${thisCard.name}</span>
<div class="divider divider-horizontal p-0 m-0"></div>
<span class="italic">Qty:</span>
<input type="number" class="input input-ghost p-0 input-sm m-0 max-w-1/5 card-list-qty-input" value="${thisCard.quantity}"/>
</div>`)

		$(`#card-list-item-${i} > .card-list-qty-input`).on("change", function (event) {
			let newQty = $(this).val();
			if (newQty <= 0) {
				cards.splice(i, 1);
				setUpdatingCard(-1);
			} else {
				cards[i].quantity = newQty;
			}
			updateCardList();
		})

		$(`#card-list-item-${i}`).on("click", function (event) {
			setUpdatingCard(i);
		})
	}
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
		setUpdatingCard(-1)
	} else {
		cards[editingIndex] = getInputCard();
	}
	updateCardList();
	saveCards();
})

$("#cancel-button").on("click", function (event) {
	setUpdatingCard(-1);
	updatePreviewCard();
})

$("#delete-save").on("click", function (event) {
	document.getElementById("confirm-delete-save").showModal()
	// cards = [];
	// newEditingCard = null;
	// saveCards();
	// setUpdatingCard(-1);
	// updateCardList();
})

$("#confirm-delete-save-cancel").on("click", function (event) {
	document.getElementById("confirm-delete-save").close()
})

$("#confirm-delete-save-yes").on("click", function (event) {
	cards = [];
	newEditingCard = null;
	saveCards();
	setUpdatingCard(-1);
	updateCardList();
})