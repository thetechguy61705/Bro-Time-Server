const { RichEmbed } = require("discord.js");

const MENU = [
	"Mac And Cheese",
	"Chicken Nuggets",
	"Rice",
	"Ice Cream",
	"Pizza",
	"French Fries",
	"Apple",
	"Pear",
	"Orange",
	"Cookie",
	"Milk",
	"Orange Juice",
	"Hotdog",
	"Cheese Burger",
	"Chicken Burger",
	"Fish Burger",
	"Noodles",
	"Taco",
	"Cake",
	"Bacon",
	"Grape Juice",
	"Apple Juice",
	"Croissant",
	"Sprite",
	"Coke",
	"Pepsi",
	"Mountain Dew",
	"Fanta",
	"Root Beer",
];

module.exports = {
	MENU: MENU,
	getMenu: function (user) {
		return new RichEmbed()
			.setColor("RED")
			.setTitle("Menu")
			.setDescription("`" + MENU.join("`\n`") + "`")
			.setFooter(`Ran by ${user.tag}.`, user.displayAvatarURL);
	}
};
