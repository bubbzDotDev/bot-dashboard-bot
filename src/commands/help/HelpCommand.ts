import { Message } from 'discord.js';
import BaseCommand from '../../utils/structures/BaseCommand';
import DiscordClient from '../../client/client';

export default class HelpCommand extends BaseCommand {
  constructor() {
    super('help', 'help', []);
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    message.channel.send('help command works');
  }
}