module.exports = {
	name: 'balance',
	description: 'Check how much money your guild has earned!',
	aliases: 'bal',
};

const Discord = require('discord.js');
const Canvas = require('canvas');
const { guildExist, getBal } = require('../database/firestore.js');

module.exports.run = async (_0, message, _1) => {
	const guildExists = await guildExist(message.guild.id);
	if (!guildExists) {
		message.reply('this guild has not been set up yet! Please tell an Administrator to use the `ad setup` command.');
		return;
	}

	const balance = await getBal(message.guild.id);

	const canvas = Canvas.createCanvas(700, 250);
	const ctx = canvas.getContext('2d');
	const applyText = (text) => {
		let fontSize = 70;

		do {
			ctx.font = `${fontSize -= 10}px sans-serif`;
		} while (ctx.measureText(text).width > canvas.width - 300);

		return ctx.font;
	};
	const background = await Canvas.loadImage('database/bal_bg.png');
	ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
	ctx.strokeStyle = '#74037b';
	ctx.strokeRect(0, 0, canvas.width, canvas.height);
	ctx.font = '28px arial';
	ctx.fillStyle = '#ffffff';
	ctx.fillText('This server has earned:', canvas.width / 2.5, canvas.height / 3.5);
	ctx.font = applyText(`$${balance} USD`);
	ctx.fillStyle = '#ffffff';
	ctx.fillText(`$${balance} USD`, canvas.width / 2.5, canvas.height / 1.8);

	ctx.beginPath();
	ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
	ctx.closePath();
	ctx.clip();

	const avatar = await Canvas.loadImage(message.guild.iconURL({
		format: 'jpg',
		dynamic: 'true',
		size: 128,
	}));
	ctx.drawImage(avatar, 25, 25, 200, 200);

	const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'guild-bal.jpg');
	message.channel.send(attachment).then(() => {
		message.channel.send('An administrator in your server can do `ad claim` to withdraw funds.');
	});

};
