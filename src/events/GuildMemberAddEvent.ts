// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildMemberAdd
import { GuildMember, TextChannel } from 'discord.js';
import BaseEvent from '../utils/structures/BaseEvent';
import DiscordClient from '../client/client';

export default class GuildMemberAddEvent extends BaseEvent {
  constructor() {
    super('guildMemberAdd');
  }

  async run(client: DiscordClient, member: GuildMember) {
    const config = client.configs.get(member.guild.id);
    if (!config) return;
    if (config.welcomeChannelId) {
      const channel = member.guild.channels.cache.get(config.welcomeChannelId) as TextChannel;
      if (!channel) {
        console.log('No welcome channel found by given ID.');
      } else {
        config.welcomeMessage ? channel.send(config.welcomeMessage) : channel.send(`Welcome ${member}!`);
      }
    } else {
      console.log('No welcome channel set.');
    }
  }
}