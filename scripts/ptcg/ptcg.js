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
		}
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
		this.quantity = 1
	}

	toJson() {
		return {
			name: this.name,
			text: this.text,
			cost: this.cost,
			damage: this.damage,
			quantity: this.quantity
		}
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
			attacksOrAbilities: this.attacksOrAbilities.map((item) => item.toJson())
		}
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
	}
}

class Trainer extends Card {
	constructor(name = "", cardType = "", additionalRules = "", subtype = "", subsubtype = "", text = "") {
		super();
		this.name = name;
		this.cardType = cardType;
		this.additionalRules = additionalRules;
		this.subtype = subtype;
		this.subsubtype = subsubtype;
		this.text = text;
	}

	toJson() {
		return {
			name: this.name,
			cardType: this.cardType,
			subtype: this.subtype,
			subsubtype: this.subsubtype,
			text: this.text
		}
	}

	fromJson(json) {
		this.name = json.name;
		this.cardType = json.cardType;
		this.subtype = json.subtype;
		this.subsubtype = json.subsubtype;
		this.text = json.text;
	}
}

class Energy extends Card {
	constructor(name = "", cardType = "", additionalRules = "", energySubtype = "", text = "") {
		super();
		this.name = name;
		this.cardType = cardType;
		this.additionalRules = additionalRules;
		this.energySubtype = energySubtype;
		this.text = text;
	}

	toJson() {
		return {
			name: this.name,
			cardType: this.cardType,
			additionalRules: this.additionalRules,
			energySubtype: this.energySubtype,
			text: this.text
		}
	}

	fromJson(json) {
		this.name = json.name;
		this.cardType = json.cardType;
		this.additionalRules = json.additionalRules;
		this.energySubtype = json.energySubtype;
		this.text = json.text;
	}
}

function saveCards() {
	let json = JSON.stringify(cards.map(card => card.toJson()));
	localStorage.setItem("ptcg-cards", json);
}

function loadCards() {
	let json = localStorage.getItem("ptcg-cards");
	if (json) {
		json = JSON.parse(json)
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
}

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
	setEditingIndex(-1);
})

function clearAllInputs() {
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
		thisCard.attacksOrAbilities = editingPokemonAttacksAndAbilities;

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
		thisCard.subsubtype = $("#trainer-subsubtype").val();
		thisCard.text = $("#trainer-text").val();
	} else if (cardType === CardType.ENERGY) {
		thisCard = new Energy();

		thisCard.text = $("#energy-text").val();
		thisCard.energySubtype = $("#energy-subtype").val();
	}

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
		</div>`

		cardContentHTML = `
		<div class="card-content">
			${
			card.attacksOrAbilities.map((item) => {
				return `<div class="card-attack-or-ability">
					<div class="top-line">
						<span>${convertStringToIconObject(item.cost, !useBlackWhiteIcons)}</span>
						<span>${item.name}</span>
						<span>${item.damage}</span>
					</div>
					<div>
						<p>${convertStringToIconObject(item.text, !useBlackWhiteIcons)}</p>
					</div>
				</div>`
			}).join("<div class=\"card-divider\"></div>")
		}
		</div>
		`

		let retreatString = ""
		for (let i = 0; i < card.retreat; i++) {
			retreatString += "{c}"
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
		`
	} else if (card.cardType === CardType.TRAINER) {
		cardTypeHTML = `<div class="grow"></div>
		<div class="card-type">
			<p>${card.subsubtype !== "" ? card.subsubtype : card.subtype}</p>
		</div>
		`

		cardContentHTML = `
		<div class="card-content"><p>${card.text}</p></div>
		`
	} else if (card.cardType === CardType.ENERGY) {
		cardTypeHTML = `<div class="grow"></div>
		<div class="card-type">
			<p>${card.energySubtype} Energy</p>
		</div>
		`

		cardContentHTML = `
		<div class="card-content"><p>${card.text}</p></div>
		`
	}

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
	`
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
				setUpdatingCard(-1);
			} else {
				cards[i].quantity = $(this).val();
			}
			updateCardList();
			saveCards();
		})
		$(`#card-list-item-${i}`).on("click", function (e) {
			if (!$(e.target).hasClass('card-list-qty-input') && !$(e.target).is(':focus')) {
				setEditingIndex(i);
			}
		})
	}
}

function updateAttacksAndAbilitiesInputs() {
	$("#attacks-abilities-container").empty();
	for (let i = 0; i < editingPokemonAttacksAndAbilities.length; i++) {
		let thisAttackOrAbility = editingPokemonAttacksAndAbilities[i];
		$("#attacks-abilities-container").append(`
<div class="collapse bg-base-100 border" id="attack-ability-${i}">
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
			updateCardPreview();
		})
		$(`#attack-ability-${i} .ability-attack-name`).on("keyup", function () {
			editingPokemonAttacksAndAbilities[i].name = $(this).val();
			updateCardPreview();
		})
		$(`#attack-ability-${i} .ability-attack-damage`).on("keyup", function () {
			editingPokemonAttacksAndAbilities[i].damage = $(this).val();
			updateCardPreview();
		})
		$(`#attack-ability-${i} .ability-attack-text`).on("keyup", function () {
			editingPokemonAttacksAndAbilities[i].text = $(this).val();
			updateCardPreview();
		})
		$(`#attack-ability-${i} .ability-attack-delete`).on("click", function () {
			editingPokemonAttacksAndAbilities.splice(i, 1);
			updateAttacksAndAbilitiesInputs();
			updateCardPreview();
		})
	}
}

function setEditingIndex(index) {
	if (index === -1) {
		clearAllInputs();
		editingPokemonAttacksAndAbilities = [];
		$("#stop-editing-card").hide();
		$("#update-card").hide();
		$("#add-card").show();
	} else {
		loadCardIntoInputs(cards[index]);
		setCardType(cards[index].cardType)
		if (cards[index].cardType === CardType.POKEMON) {
			editingPokemonAttacksAndAbilities = cards[index].attacksOrAbilities;
		}
		$("#stop-editing-card").show();
		$("#update-card").show();
		$("#add-card").hide();
	}

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
		$("#trainer-subsubtype").val(card.subsubtype);
		$("#trainer-text").val(card.text);
	} else if (card.cardType === CardType.ENERGY) {
		$("#energy-subtype").val(card.energySubtype);
		$("#energy-text").val(card.text);
	}

	$("#card-name").val(card.name);
	$("#pokemon-rules").val(card.additionalRules);
	$("#card-type").val(card.cardType);
}

$("#card-type").on("change", function () {
	let value = $(this).val();
	setCardType(value);
})

$("#add-card-form").on("keyup", function () {
	updateCardPreview();
})

$("#add-attack-ability").on("click", function () {
	let thisAttackAbility = new AttackOrAbility($("#ability-attack-name").val(), $("#ability-attack-text").val(), $("#ability-attack-type").val(), $("#ability-attack-damage").val());
	editingPokemonAttacksAndAbilities.push(thisAttackAbility);
	updateAttacksAndAbilitiesInputs();
	updateCardPreview();
})

$("#add-card").on("click", function () {
	let thisCard = getInputCard();
	cards.push(thisCard);
	clearAllInputs();
	setEditingIndex(-1);
	updateCardList();
	saveCards();
})

$("#update-card").on("click", function () {
	if (editingIndex === -1) {
		return
	}
	cards[editingIndex] = getInputCard();
	clearAllInputs();
	saveCards();
})

$("#stop-editing-card").on("click", function () {
	console.log("cancel");
	setEditingIndex(-1);
	clearAllInputs();
})

$("#clear-card").on("click", function () {
	clearAllInputs();
})