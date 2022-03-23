import { Message, TextChannel } from 'discord.js';
import BaseCommand from '../../utils/structures/BaseCommand';
import DiscordClient from '../../client/client';
import { AppDataSource } from '../../typeorm/data-source';
import { GuildConfiguration } from '../../typeorm/entities/GuildConfiguration';

export default class WelcomeCommand extends BaseCommand {
  constructor(
    private readonly guildConfigRepository = AppDataSource.manager.getRepository(GuildConfiguration)
  ) {
    super('welcome', 'mod', []);
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const config = client.configs.get(message.guildId);
    const channel = message.guild.channels.cache.get(config.welcomeChannelId) as TextChannel;
    if (!args.length) {
      if (!config.welcomeChannelId) {
        message.channel.send(`A welcome channel is not configured yet.\n\nTo add one, include a channel mention or channel ID in your command:\n\`${config.prefix}welcome #channel-name\`\nor\n\`${config.prefix}welcome 12345...\`\n\n(Replacing \`#channel-name\` / \`12345...\` with your desired channel mention or channel ID number.)`);
        return;
      } else {
        message.channel.send(`The current welcome channel is ${channel}\n\nTo update it, include a channel mention or channel ID in your command:\n\`${config.prefix}welcome #channel-name\`\nor\n\`${config.prefix}welcome 12345...\`\n\n(Replacing \`#channel-name\` / \`12345...\` with your desired channel mention or channel ID number.)`);
        return;
      }
    }
    let [newChannelId] = args;
    if (newChannelId[0] === '<') {
      newChannelId = newChannelId.slice(2, -1);
    }
    if (newChannelId === config.welcomeChannelId) {
      message.channel.send(`${channel} is already the welcome channel.`);
      return;
    }
    try {
      const updatedConfig = await this.guildConfigRepository.save({
        ...config,
        welcomeChannelId: newChannelId,
      });
      client.configs.set(message.guildId, updatedConfig);
      const newChannel = message.guild.channels.cache.get(updatedConfig.welcomeChannelId) as TextChannel;
      message.channel.send(`Welcome channel updated! It is now ${newChannel}`);
    } catch (err) {
      console.log(err);
      message.channel.send(`Something went wrong. Error message: "${err}"`);
    }
  }
}