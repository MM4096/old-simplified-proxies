const CardType = Object.freeze({
	POKEMON: "pokemon",
	TRAINER: "trainer",
	ENERGY: "energy",
	NONE: ""
});

let cards = [];
let editingIndex = -1;

//region Classes
class Card {
	constructor(name = "", cardType = "", additionalRules = "") {
		this.name = name;
		this.cardType = cardType;
		this.additionalRules = additionalRules;
	}

	toJson() {
		return {
			name: this.name,
			cardType: this.cardType,
			additionalRules: this.additionalRules
		};
	}

	fromJson(json) {
		this.name = json.name;
	}
}

class AttackOrAbility {
	constructor(name = "", text = "", cost = "", damage = "") {
		this.name = name;
		this.text = text;
		this.cost = cost;
		this.damage = damage;
		this.quantity = 1;
	}

	toJson() {
		return {
			name: this.name,
			text: this.text,
			cost: this.cost,
			damage: this.damage,
			quantity: this.quantity
		};
	}

	fromJson(json) {
		this.name = json.name;
		this.text = json.text;
		this.cost = json.cost;
		this.damage = json.damage;
		this.quantity = json.quantity;
	}
}

class Pokemon extends Card {
	constructor(name = "", cardType = "", additionalRules = "", pokemonType = "", hp = "", evolutionLevel = "", evolvesFrom = "",
				weakness = "", resistance = "", retreat = "", attacksOrAbilities = []) {
		super();
		this.name = name;
		this.cardType = cardType;
		this.additionalRules = additionalRules;
		this.pokemonType = pokemonType;
		this.hp = hp;
		this.evolutionLevel = evolutionLevel;
		this.evolvesFrom = evolvesFrom;
		this.weakness = weakness;
		this.resistance = resistance;
		this.retreat = retreat;
		this.attacksOrAbilities = attacksOrAbilities;
		this.quantity = 1;
	}

	toJson() {
		return {
			name: this.name,
			cardType: this.cardType,
			pokemonType: this.pokemonType,
			hp: this.hp,
			evolutionLevel: this.evolutionLevel,
			evolvesFrom: this.evolvesFrom,
			weakness: this.weakness,
			resistance: this.resistance,
			retreat: this.retreat,
			attacksOrAbilities: this.attacksOrAbilities.map((item) => item.toJson()),
			quantity: this.quantity
		};
	}

	fromJson(json) {
		this.name = json.name;
		this.cardType = json.cardType;
		this.pokemonType = json.pokemonType;
		this.hp = json.hp;
		this.evolutionLevel = json.evolutionLevel;
		this.evolvesFrom = json.evolvesFrom;
		this.weakness = json.weakness;
		this.resistance = json.resistance;
		this.retreat = json.retreat;
		this.attacksOrAbilities = json.attacksOrAbilities.map(item => {
			const attack = new AttackOrAbility();
			attack.fromJson(item);
			return attack;
		});
		this.quantity = json.quantity || 1;
	}
}

class Trainer extends Card {
	constructor(name = "", cardType = "", additionalRules = "", subtype = "", subsubtype = "", text = "", attacksOrAbilities = []) {
		super();
		this.name = name;
		this.cardType = cardType;
		this.additionalRules = additionalRules;
		this.subtype = subtype;
		this.subsubtype = subsubtype;
		this.text = text;
		this.attacksOrAbilities = attacksOrAbilities;
		this.quantity = 1;
	}

	toJson() {
		return {
			name: this.name,
			cardType: this.cardType,
			subtype: this.subtype,
			subsubtype: this.subsubtype,
			text: this.text,
			attacksOrAbilities: this.attacksOrAbilities.map((item) => item.toJson()),
			quantity: this.quantity
		};
	}

	fromJson(json) {
		this.name = json.name;
		this.cardType = json.cardType;
		this.subtype = json.subtype;
		this.subsubtype = json.subsubtype;
		this.text = json.text;
		this.attacksOrAbilities = json.attacksOrAbilities.map(item => {
			return new AttackOrAbility().fromJson(item);
		});
		this.quantity = json.quantity || 1;
	}
}

class Energy extends Card {
	constructor(name = "", cardType = "", additionalRules = "", energySubtype = "", text = "", attacksOrAbilities = []) {
		super();
		this.name = name;
		this.cardType = cardType;
		this.additionalRules = additionalRules;
		this.energySubtype = energySubtype;
		this.text = text;
		this.attacksOrAbilities = attacksOrAbilities;
		this.quantity = 1;
	}

	toJson() {
		return {
			name: this.name,
			cardType: this.cardType,
			additionalRules: this.additionalRules,
			energySubtype: this.energySubtype,
			text: this.text,
			attacksOrAbilities: this.attacksOrAbilities.map((item) => item.toJson()),
			quantity: this.quantity
		};
	}

	fromJson(json) {
		this.name = json.name;
		this.cardType = json.cardType;
		this.additionalRules = json.additionalRules;
		this.energySubtype = json.energySubtype;
		this.text = json.text;
		this.attacksOrAbilities = json.attacksOrAbilities.map(item => {
			return new AttackOrAbility().fromJson(item);
		});
		this.quantity = json.quantity || 1;
	}
}

function saveCards() {
	let json = JSON.stringify(cards.map(card => card.toJson()));
	localStorage.setItem("ptcg-cards", json);
}

function loadCards() {
	let json = localStorage.getItem("ptcg-cards");
	if (json) {
		json = JSON.parse(json);
		for (let i = 0; i < json.length; i++) {
			let thisCard = json[i];
			let card = new Card();
			if (thisCard.cardType === CardType.POKEMON) {
				card = new Pokemon();
			} else if (thisCard.cardType === CardType.TRAINER) {
				card = new Trainer();
			} else if (thisCard.cardType === CardType.ENERGY) {
				card = new Energy();
			}
			card.fromJson(thisCard);
			card.fromJson(json[i]);
			cards.push(card);
		}
	} else {
		cards = [];
	}
}

//endregion

let templateCards = {
	"pokemon": new Pokemon("Test Pokemon ex", "pokemon", "EX Rule: When this pokemon is Knocked Out, your opponent takes an extra prize card", "{f}", "310", "Stage 1", "Eevee?", "{g} x2", "{r} -30", "3", [new AttackOrAbility("Test Ability", "Draw a card. You may only use 1 Test Ability per turn.", "Ability", ""), new AttackOrAbility("Test Attack", "Deal 30 damage to one Pokemon", "{g}{g}{c}", "310")]),
	"trainer": new Trainer("Test Tool", "trainer", "You may only have one Tool card attached to a Pokemon.", "Pokemon Tool", "", "The basic Pokemon this card is attached to has -30HP, and its attacks deal 50 more damage to your opponent's Active Pokemon."),
	"energy": new Energy("Test Energy", "energy", "This card can only be attached to a Pokemon.", "Basic", "As long as this card is attached to a Pokemon with less than 100HP remaining, it provides {c}{c}{c}.\nOtherwise, it provides {c}."),
};

let selectedCardType = CardType.NONE;
let editingPokemonAttacksAndAbilities = [];
$(document).ready(function () {
	loadCards();

	$(".type-pokemon").hide();
	$(".type-trainer").hide();
	$(".type-energy").hide();
	setCardType($("#card-type").val());

	$("#card-preview").html(getCardHTML(templateCards.energy));
	updateCardList();
	setEditingCardIndex(-1);
});

function clearInputs() {
	$("#add-card-form input").val("");
	$("#add-card-form textarea").val("");
	$("#add-card-form select").val("");
	$("#attacks-abilities-container").empty();
}

function getInputCard() {
	let cardType = $("#card-type").val();
	let thisCard = new Card();
	if (cardType === CardType.POKEMON) {
		thisCard = new Pokemon();

		thisCard.pokemonType = $("#pokemon-type").val();
		thisCard.hp = $("#pokemon-hp").val();
		thisCard.evolutionLevel = $("#pokemon-level").val();
		thisCard.evolvesFrom = $("#pokemon-evolves-from").val();
		thisCard.weakness = $("#pokemon-weakness").val();
		thisCard.resistance = $("#pokemon-resistance").val();
		thisCard.retreat = $("#pokemon-retreat-cost").val();

	} else if (cardType === CardType.TRAINER) {
		thisCard = new Trainer();

		thisCard.subtype = $("#trainer-subtype").val();
		// thisCard.subsubtype = $("#trainer-subsubtype").val();
		thisCard.text = $("#trainer-text").val();
	} else if (cardType === CardType.ENERGY) {
		thisCard = new Energy();

		thisCard.text = $("#energy-text").val();
		thisCard.energySubtype = $("#energy-subtype").val();
	}

	thisCard.attacksOrAbilities = editingPokemonAttacksAndAbilities;
	thisCard.name = $("#card-name").val();
	thisCard.cardType = cardType;
	thisCard.additionalRules = $("#pokemon-rules").val();
	return thisCard;
}

function getCardHTML(card) {
	let useBlackWhiteIcons = $("#use-black-white-icons").is(":checked");
	let pokemonEvolutionTypeHTML = "";
	let cardTypeHTML = "";
	let cardContentHTML = "";
	let cardBottomLineHTML = "<div class=\"card-bottom-line\"></div>";

	if (card.cardType === CardType.POKEMON) {
		pokemonEvolutionTypeHTML = `
		<div class="card-evolution-type">
			${card.evolutionLevel}
			${card.evolvesFrom !== "" ? `
				<div class="card-divider card-divider-vertical"></div>
				<p>Evolves from:</p>
				<p>${card.evolvesFrom}</p>				
			` : ""}
		</div>
		<div class="card-divider"></div>
		`;
		cardTypeHTML = `<div class="grow"></div>
		<div class="card-type">
			<p>${card.hp}HP</p>
			<p>${convertStringToIconObject(card.pokemonType, !useBlackWhiteIcons)}</p>
		</div>`;

		let retreatString = "";
		for (let i = 0; i < card.retreat; i++) {
			retreatString += "{c}";
		}
		cardBottomLineHTML = `
		<div class="card-divider"></div>
		<div class="card-bottom-line">
			<p>Weakness: ${convertStringToIconObject(card.weakness, !useBlackWhiteIcons)}</p>
			<div class="card-divider card-divider-vertical"></div>
			<p>Resistance: ${convertStringToIconObject(card.resistance, !useBlackWhiteIcons)}</p>
			<div class="card-divider card-divider-vertical"></div>
			<p>Retreat Cost: ${convertStringToIconObject(retreatString, !useBlackWhiteIcons)}</p>
		</div>
		`;
	} else if (card.cardType === CardType.TRAINER) {
		cardTypeHTML = `<div class="grow"></div>
		<div class="card-type">
			<p>${card.subsubtype !== "" ? card.subsubtype : card.subtype}</p>
		</div>
		`;

		cardContentHTML = `
		<div class="card-content">${convertStringToIconObject(card.text, !useBlackWhiteIcons)}</div>
		`;
	} else if (card.cardType === CardType.ENERGY) {
		cardTypeHTML = `<div class="grow"></div>
		<div class="card-type">
			<p>${card.energySubtype} Energy</p>
		</div>
		`;

		cardContentHTML = `
		<div class="card-content">${convertStringToIconObject(card.text, !useBlackWhiteIcons)}</div>
		`;
	}

	cardContentHTML += `
		<div class="card-content">
			${
		card.attacksOrAbilities.map((item) => {
			return `<div class="card-attack-or-ability">
					<div class="top-line">
						<span>${convertStringToIconObject(item.cost, !useBlackWhiteIcons)}</span>
						<span>${item.name}</span>
						<span>${item.damage}</span>
					</div>
					<div><p>${convertStringToIconObject(item.text, !useBlackWhiteIcons)}</p></div>
				</div>`;
		}).join("<div class=\"card-divider\"></div>")
	}
		</div>
		`;

	return `
<div class="card-container">
	<div class="card-title-container">
		<h1 class="card-title">${convertStringToIconObject(card.name, !useBlackWhiteIcons)}</h1>
		${cardTypeHTML}
	</div>
	<div class="card-divider"></div>
	${pokemonEvolutionTypeHTML}
	${cardContentHTML}
	
	<div class="grow"></div>
	<div class="card-divider"></div>
	<div class="card-additional-rules">${convertStringToIconObject(card.additionalRules || "", !useBlackWhiteIcons)}</div>
	${cardBottomLineHTML}
</div>
	`;
}

function setCardType(type) {
	if (type === "") {
		return;
	}
	$(".type-pokemon").hide();
	$(".type-trainer").hide();
	$(".type-energy").hide();
	$(".type-" + type).show();
	selectedCardType = type;
}

function updateCardPreview() {
	$("#card-preview").html(getCardHTML(getInputCard()));
}

function updateCardList() {
	let cardList = $("#card-list");
	cardList.empty();

	if (cards.length === 0) {
		cardList.append(`<div class="p-3 rounded-md border">No cards</div>`);
		return;
	}

	for (let i = 0; i < cards.length; i++) {
		let thisCard = cards[i];
		cardList.append(`
<div class="p-3 rounded-md border hover:bg-gray-200 flex flex-row items-center card-list-item" id="card-list-item-${i}">
	<span class="grow">${thisCard.name}</span>
	<div class="divider divider-horizontal p-0 m-0"></div>
	<span class="italic">Qty:</span>
	<input type="number" class="input input-ghost p-0 input-sm m-0 max-w-1/5 card-list-qty-input" value="${thisCard.quantity || 1}"/>
</div>
		`);
		$(`#card-list-item-${i} > .card-list-qty-input`).on("change", function () {
			let quantity = $(this).val();
			if (quantity <= 0) {
				cards.splice(i, 1);
				setEditingCardIndex(-1);
			} else {
				cards[i].quantity = $(this).val();
			}
			updateCardList();
			saveCards();
		});
		$(`#card-list-item-${i}`).on("click", function (e) {
			if (!$(e.target).hasClass('card-list-qty-input') && !$(e.target).is(':focus')) {
				setEditingCardIndex(i);
			}
		});
	}
}

function updateAttacksAndAbilitiesInputs() {
	$("#attacks-abilities-container").empty();
	for (let i = 0; i < editingPokemonAttacksAndAbilities.length; i++) {
		let thisAttackOrAbility = editingPokemonAttacksAndAbilities[i];
		$("#attacks-abilities-container").append(`
<div class="collapse bg-base-300 border" id="attack-ability-${i}">
<input type="checkbox"/>
<div class="collapse-title">${i}</div>
<div class="collapse-content flex flex-col">
	<fieldset class="fieldset">
		<legend class="fieldset-legend">Attack Cost/Ability Type</legend>
		<input type="text" value="${thisAttackOrAbility.cost}"
		   placeholder="e.g. &quot;{R}{R}&quot; or &quot;Poke-Body&quot;"
		   class="input grow ability-attack-type"/>
	</fieldset>
	<fieldset class="fieldset">
		<legend class="fieldset-legend">Attack/Ability Name</legend>
		<input type="text" value="${thisAttackOrAbility.name}"
		   placeholder="e.g. &quot;Itchy Pollen&quot; or &quot;Flip the Script&quot;"
		   class="input grow ability-attack-name"/>
	</fieldset>
	<fieldset class="fieldset">
		<legend class="fieldset-legend">Attack Damage</legend>
		<input type="text" placeholder="e.g. 100+" value="${thisAttackOrAbility.damage}"
		   class="input grow ability-attack-damage"/>
		<p class="label">Can be ignored for abilities</p>
	</fieldset>
	<fieldset class="fieldset">
		<legend class="fieldset-legend">Attack/Ability Text</legend>
		<textarea placeholder="e.g. During your opponent's next turn, they can't play Item cards from their hand."
		  class="textarea min-h-20 ability-attack-text">${thisAttackOrAbility.text}</textarea>
	</fieldset>
	<button class="btn btn-secondary ability-attack-delete">Delete</button>
</div>
</div>`);

		$(`#attack-ability-${i} .ability-attack-type`).on("keyup", function () {
			editingPokemonAttacksAndAbilities[i].cost = $(this).val();
			saveCards();
			updateCardPreview();
		});
		$(`#attack-ability-${i} .ability-attack-name`).on("keyup", function () {
			editingPokemonAttacksAndAbilities[i].name = $(this).val();
			saveCards();
			updateCardPreview();
		});
		$(`#attack-ability-${i} .ability-attack-damage`).on("keyup", function () {
			editingPokemonAttacksAndAbilities[i].damage = $(this).val();
			saveCards();
			updateCardPreview();
		});
		$(`#attack-ability-${i} .ability-attack-text`).on("keyup", function () {
			editingPokemonAttacksAndAbilities[i].text = $(this).val();
			saveCards();
			updateCardPreview();
		});
		$(`#attack-ability-${i} .ability-attack-delete`).on("click", function () {
			editingPokemonAttacksAndAbilities.splice(i, 1);
			saveCards();
			updateAttacksAndAbilitiesInputs();
			updateCardPreview();
		});
	}
}

function setEditingCardIndex(index) {
	if (index === -1) {
		clearInputs();
		editingPokemonAttacksAndAbilities = [];
		$("#stop-editing-card").hide();
		$("#update-card").hide();
		$("#add-card").show();
	} else {
		loadCardIntoInputs(cards[index]);
		setCardType(cards[index].cardType);
		editingPokemonAttacksAndAbilities = cards[index].attacksOrAbilities;
		$("#stop-editing-card").show();
		$("#update-card").show();
		$("#add-card").hide();
	}

	editingIndex = index;
	updateAttacksAndAbilitiesInputs();
	updateCardList();
	updateCardPreview();
}

function loadCardIntoInputs(card) {
	if (card.cardType === CardType.POKEMON) {
		$("#pokemon-type").val(card.pokemonType);
		$("#pokemon-hp").val(card.hp);
		$("#pokemon-level").val(card.evolutionLevel);
		$("#pokemon-evolves-from").val(card.evolvesFrom);
		$("#pokemon-weakness").val(card.weakness);
		$("#pokemon-resistance").val(card.resistance);
		$("#pokemon-retreat-cost").val(card.retreat);
	} else if (card.cardType === CardType.TRAINER) {
		$("#trainer-subtype").val(card.subtype);
		// $("#trainer-subsubtype").val(card.subsubtype);
		$("#trainer-text").val(card.text);
	} else if (card.cardType === CardType.ENERGY) {
		$("#energy-subtype").val(card.energySubtype);
		$("#energy-text").val(card.text);
	}

	editingPokemonAttacksAndAbilities = card.attacksOrAbilities;
	updateAttacksAndAbilitiesInputs();
	$("#card-name").val(card.name);
	$("#pokemon-rules").val(card.additionalRules);
	$("#card-type").val(card.cardType);
}

function printProxies() {
	let printCardsHtml = "";
	let useBlackWhiteIcons = !$("#use-black-white-icons").is(":checked");

	for (let i = 0; i < cards.length; i++) {
		let thisCard = cards[i];
		for (let j = 0; j < thisCard.quantity; j++) {
			printCardsHtml += getCardHTML(thisCard, useBlackWhiteIcons, `card-proxy-${thisCard.name}-${j}`);
		}
	}

	let printWin = window.open("", "_blank");
	printWin.document.write(`
<!DOCTYPE html><html lang="en"><head><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Print Proxies</title><link rel="stylesheet" href="styles/ptcg.css"/><link rel="stylesheet" href="styles/print.css"/></head>
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
	};
}

$("#card-type").on("change", function () {
	let value = $(this).val();
	setCardType(value);
});

$("#add-card-form").on("keyup", function () {
	updateCardPreview();
});

$("#add-attack-ability").on("click", function () {
	let thisAttackAbility = new AttackOrAbility($("#ability-attack-name").val(), $("#ability-attack-text").val(), $("#ability-attack-type").val(), $("#ability-attack-damage").val());
	editingPokemonAttacksAndAbilities.push(thisAttackAbility);
	updateAttacksAndAbilitiesInputs();
	updateCardPreview();
});

$("#add-card").on("click", function () {
	let thisCard = getInputCard();
	cards.push(thisCard);
	clearInputs();
	setEditingCardIndex(-1);
	updateCardList();
	saveCards();
});

$("#update-card").on("click", function () {
	if (editingIndex === -1) {
		return;
	}
	cards[editingIndex] = getInputCard();
	saveCards();
});

$("#stop-editing-card").on("click", function () {
	setEditingCardIndex(-1);
	clearInputs();
});

$("#clear-card").on("click", function () {
	clearInputs();
});

$("#use-black-white-icons").on("change", function () {
	updateCardPreview();
});

$("#card-name").on("keyup", function (e) {
	if (e.key === "Enter") {
		if ($("#use-ptcgapi-search").is(":checked")) {
			getApiCard(e.target.value).then((card) => {
				if (card) {
					loadCardIntoInputs(card);
					updateCardPreview();
				}
			});
		}
	}
});

$("#preview-all-proxies").on("click", function (event) {
	let container = $("#preview-all-cards-container");
	let useBlackWhiteIcons = !$("#use-black-white-icons").is(":checked");
	container.empty();
	for (let i = 0; i < cards.length; i++) {
		let thisCard = cards[i];
		for (let j = 0; j < thisCard.quantity; j++) {
			let thisHTML = getCardHTML(thisCard, useBlackWhiteIcons, `card-proxy-${thisCard.name}-${j}`);
			container.append(thisHTML);
		}
	}

	document.getElementById("preview-all-cards-box").showModal();
});

function showError(error) {
	document.getElementById("error-box").showModal();
	$("#error-message").text(error);
}

async function getSetIdFromCode(code) {
	let response = await fetch(`https://api.pokemontcg.io/v2/sets?q=(ptcgoCode:${code} OR id:${code})&select=id,name,ptcgoCode`);
	if (!response.ok) {
		showError(`Error ${response.status}: ${response.statusText} (in: getSerIdFromCode)`);
		return null;
	}
	let responseJson = await response.json();
	if (responseJson["totalCount"] === 0) {
		showError(`No set found with code: ${code}`);
		return null;
	}
	return responseJson["data"][0]["id"];
}

async function getApiCard(query) {
	let response;

	let isId = query.startsWith("id:");
	if (isId) {
		query = query.replace("id:", "");
		query = query.replaceAll(" ", "-");
		query = query.trim();
		let parts = query.split("-");

		let setId = await getSetIdFromCode(parts[0]);

		response = await fetch(`https://api.pokemontcg.io/v2/cards/${setId}-${parts[1]}`);
	} else {
		response = await fetch(`https://api.pokemontcg.io/v2/cards?q=name:"${query}"`);
	}

	if (!response.ok) {
		return null;
	}

	let json = await response.json();
	console.log(json);

	if (Array.isArray(json.data)) {
		if (json.data.length === 0) {
			return null;
		}
		json = json.data[json.data.length - 1];
	} else {
		json = json.data;
	}

	let thisCard = new Card();


	switch (json["supertype"].toLowerCase()) {
		case "energy":
			thisCard = new Energy();
			thisCard.cardType = CardType.ENERGY;
			thisCard.energySubtype = json["subtypes"][0];
			break;
		case "trainer":
			thisCard = new Trainer();
			thisCard.cardType = CardType.TRAINER;
			thisCard.subtype = json["subtypes"][0];
			if (thisCard.subtype.indexOf("Tool") > -1) {
				thisCard.subtype = "Pokemon Tool";
			}
			break;
		case "pokémon":
			thisCard = new Pokemon();
			thisCard.cardType = CardType.POKEMON;
			thisCard.hp = json["hp"];
			thisCard.pokemonType = json["types"].join(" ");
			thisCard.evolutionLevel = json["subtypes"].join(" ");
			if (json["weaknesses"]) {
				thisCard.weakness = json["weaknesses"].map((item) => {
					return `${item.type} ${item.value}`;
				}).join(" ");
			}
			if (json["resistances"]) {
				thisCard.resistance = json["resistances"].map((item) => {
					return `${item.type} ${item.value}`;
				}).join(" ");
			}
			if (json["retreatCost"]) {
				thisCard.retreat = json["retreatCost"].length;
				if (json["evolvesFrom"]) {
					thisCard.evolvesFrom = json["evolvesFrom"];
				}
			}
			break;
	}

	thisCard.name = json["name"];
	if (json["rules"] && json["rules"].length > 0) {
		thisCard.text = json["rules"][0];

		json["rules"].shift();

		thisCard.additionalRules = json["rules"].join("\n");
	}

	if (json["abilities"]) {
		for (let i = 0; i < json["abilities"].length; i++) {
			let thisAbility = json["abilities"][i];
			let abilityObject = new AttackOrAbility();
			abilityObject.name = thisAbility.name;
			abilityObject.cost = thisAbility.type;
			abilityObject.text = thisAbility.text;

			thisCard.attacksOrAbilities.push(abilityObject);
		}
	}

	if (json["attacks"]) {
		for (let i = 0; i < json["attacks"].length; i++) {
			let thisAttack = json["attacks"][i];
			let attackObject = new AttackOrAbility();
			attackObject.name = thisAttack.name;
			attackObject.cost = thisAttack.cost.join(" ");
			attackObject.text = thisAttack.text;
			attackObject.damage = thisAttack.damage;

			thisCard.attacksOrAbilities.push(attackObject);
		}
	}

	return thisCard;
}