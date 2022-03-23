import { Message } from 'discord.js';
import BaseCommand from '../../utils/structures/BaseCommand';
import DiscordClient from '../../client/client';
import { AppDataSource } from '../../typeorm/data-source';
import { GuildConfiguration } from '../../typeorm/entities/GuildConfiguration';

export default class PrefixCommand extends BaseCommand {
  constructor(
    private readonly guildConfigRepository = AppDataSource.manager.getRepository(GuildConfiguration)
  ) {
    super('prefix', 'mod', []);
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const config = client.configs.get(message.guildId);
    if (!args.length) {
      message.channel.send(`To update the prefix, add a new one in your command, replacing \`new\` with your desired prefix: \`${config.prefix}prefix new\``);
      return;
    }
    const [newPrefix] = args;
    try {
      const updatedConfig = await this.guildConfigRepository.save({
        ...config,
        prefix: newPrefix,
      });
      client.configs.set(message.guildId, updatedConfig);
      message.channel.send(`Prefix updated! It is now \`${updatedConfig.prefix}\``);
    } catch (err) {
      console.log(err);
      message.channel.send(`Something went wrong. Error message: "${err}"`);
    }
  }
}