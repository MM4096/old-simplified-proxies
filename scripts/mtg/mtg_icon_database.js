const STANDARD_PATH = "standard";
const BLACK_WHITE_PATH = "black-white";

let cachedIcons = {};

function getIconCode(code, isColorIcon = true, useSmallIcon = false) {
	if (cachedIcons[code]) {
		return cachedIcons[code];
	}

	let domain = window.location.host;
	let path = `${domain}/images/mtg/icons/${isColorIcon ? STANDARD_PATH : BLACK_WHITE_PATH}/${code}.png`;

	return `<img src="${path}" alt="${code}" class="${useSmallIcon ? "mana-symbol-small" : "mana-symbol"}" />`
}