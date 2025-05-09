const STANDARD_PATH = "standard";
const BLACK_WHITE_PATH = "black-white";

function getIconObject(code, isColorIcon = true) {
	let split_code = code.split("}");
	let codes = "";
	for (let i = 0; i < split_code.length; i++) {
		let item = split_code[i];
		item = item.replaceAll("{", "");
		item = item.replaceAll(" ", "");
		item = item.replaceAll("}", "");
		if (item === "") {
			continue;
		}

		codes += getIconCode(item, isColorIcon);
	}

	return codes;
}

function convertStringToIconObject(string, isColorIcon = true) {

	string = string.replaceAll("Dragon", "{a}");
	string = string.replaceAll("Colorless", "{c}");
	string = string.replaceAll("Darkness", "{d}");
	string = string.replaceAll("Fighting", "{f}");
	string = string.replaceAll("Grass", "{g}");
	string = string.replaceAll("Lightning", "{l}");
	string = string.replaceAll("Metal", "{m}");
	string = string.replaceAll("Psychic", "{p}");
	string = string.replaceAll("Fire", "{r}");
	string = string.replaceAll("Water", "{w}");
	string = string.replaceAll("Fairy", "{y}");
	string = string.replaceAll("Free", "{n}");

	string = string.replaceAll("okemon", "okémon")


	const matches = string.match(/(?<!\\)\{.*?}/g);

	let codes = string;

	if (matches === null) {
		return codes;
	}

	for (let i = 0; i < matches.length; i++) {
		let match = matches[i];
		match = match.replaceAll("{", "");
		match = match.replaceAll("}", "");
		match = match.replaceAll(" ", "");
		if (match === "") {
			continue;
		}

		codes = codes.replaceAll(`\\${matches[i]}`, "THISTEXTSHOULDNEVERBEPLACEDINTOATEXTBOX!~?");
		codes = codes.replaceAll(matches[i], getIconCode(match, isColorIcon));
		codes = codes.replaceAll("THISTEXTSHOULDNEVERBEPLACEDINTOATEXTBOX!~?", `{${match}}`);
	}

	return codes;
}

function getIconCode(code, isColorIcon = true) {
	code = code.toLowerCase();
	code = code.replaceAll("/", "");
	let path = `images/ptcg/icons/${isColorIcon ? STANDARD_PATH : BLACK_WHITE_PATH}/${code}.png`;
	let fallbackPath = `images/ptcg/icons/${STANDARD_PATH}/${code}.png`;
	return `<img src="${path}" alt="${code}" class="energy-symbol" onerror="if (this.src !== '${fallbackPath}' && !this.dataset.fallback) {  this.dataset.fallback='true'; this.src='${fallbackPath}';}" />`
}