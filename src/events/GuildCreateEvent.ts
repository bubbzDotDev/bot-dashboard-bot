// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildCreate
import { Guild } from 'discord.js';
import BaseEvent from '../utils/structures/BaseEvent';
import DiscordClient from '../client/client';
import { AppDataSource } from '../typeorm/data-source';
import { GuildConfiguration } from '../typeorm/entities/GuildConfiguration';

export default class GuildCreateEvent extends BaseEvent {
  constructor(
    private readonly guildConfigRepository = AppDataSource.manager.getRepository(GuildConfiguration)
  ) {
    super('guildCreate');
  }
  
  async run(client: DiscordClient, guild: Guild) {

    const config = await this.guildConfigRepository
      .createQueryBuilder('guild_configurations')
      .where('guild_Id = :id', { id: guild.id })
      .getOne();

    if (config) {
      client.configs.set(guild.id, config);
    } else {
      const newConfig = this.guildConfigRepository.create({ guildId: guild.id });
      const savedConfig = await this.guildConfigRepository.save(newConfig);
      client.configs.set(guild.id, savedConfig);
    }
  }
}