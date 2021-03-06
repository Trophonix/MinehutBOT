import { Message } from 'discord.js';
import { MinehutCommand } from '../../../structure/command/minehutCommand';
import { PermissionLevel } from '../../../util/permission/permissionLevel';

export default class CleanBotsCommand extends MinehutCommand {
	constructor() {
		super('clean-bots', {
			category: 'mod',
			channel: 'guild',
			permissionLevel: PermissionLevel.JuniorModerator,
			description: {
				content: 'Clean x amount of bot messages',
				usage: '<count>',
			},
			args: [
				{
					id: 'count',
					type: (_msg, phrase) => {
						if (!phrase || isNaN(parseInt(phrase))) return null;
						const num = parseInt(phrase);
						if (num < 2 || num > 100) return null;
						return num;
					},
					prompt: {
						start: (msg: Message) =>
							`${msg.author}, how many messages do you want to clean? (2-100)`,
						retry: (msg: Message) =>
							`${msg.author}, please enter a number between 2 and 100.`,
					},
				},
			],
		});
	}

	async exec(msg: Message, { count }: { count: number }) {
		const messages = await msg.channel.messages.fetch();
		const filtered = messages
			.filter(m => m.author.bot && m.id !== msg.id)
			.sort((a, b) => b.createdTimestamp - a.createdTimestamp)
			.array()
			.slice(0, count);
		await msg.channel.bulkDelete(filtered);
		msg.channel.send(`:ok_hand: deleted ${filtered.length} messages`);
	}
}
