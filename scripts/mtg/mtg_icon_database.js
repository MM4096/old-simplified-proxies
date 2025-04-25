const STANDARD_PATH = "standard";
const BLACK_WHITE_PATH = "black-white";

function getIconObject(code, isColorIcon = true, useSmallIcon = false) {
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

		codes += getIconCode(item, isColorIcon, useSmallIcon);
	}

	return codes;
}

function convertStringToIconObject(string, isColorIcon = true, useSmallIcon = false) {
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
		codes = codes.replaceAll(matches[i], getIconCode(match, isColorIcon, useSmallIcon));
		codes = codes.replaceAll("THISTEXTSHOULDNEVERBEPLACEDINTOATEXTBOX!~?", `{${match}}`);
	}

	return codes;
}

function getIconCode(code, isColorIcon = true, useSmallIcon = false) {
	code = code.toLowerCase();
	code = code.replaceAll("/", "");
	let path = `images/mtg/icons/${isColorIcon ? STANDARD_PATH : BLACK_WHITE_PATH}/${code}.png`;
	let fallbackPath = `images/mtg/icons/${STANDARD_PATH}/${code}.png`;
	return `<img src="${path}" alt="${code}" class="${useSmallIcon ? "mana-symbol-small" : "mana-symbol"}" onerror="this.src ='${fallbackPath}'" />`
}