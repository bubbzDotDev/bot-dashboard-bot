import { Message } from 'discord.js';
import BaseCommand from '../../utils/structures/BaseCommand';
import DiscordClient from '../../client/client';

export default class AnnounceCommand extends BaseCommand {
  constructor() {
    super('announce', 'mod', []);
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    message.channel.send('announce command works');
  }
}
