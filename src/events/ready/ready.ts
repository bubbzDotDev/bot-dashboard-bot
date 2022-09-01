import BaseEvent from '../../utils/structures/BaseEvent';
import DiscordClient from '../../client/client';
import { ActivityType } from 'discord.js'

export default class ReadyEvent extends BaseEvent {
  constructor() {
    super('ready');
  }
  async run (client: DiscordClient) {
    console.log('Bot has logged in.');
    client.user.setActivity(`new dashboard at www.announcementbot.live`, { type: ActivityType.Watching });
  }
}