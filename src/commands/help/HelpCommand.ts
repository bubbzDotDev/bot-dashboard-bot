import { SlashCommandBuilder } from 'discord.js';

const helpCommand = new SlashCommandBuilder()
    .setName('help')
    .setDescription('Help Command');

export default helpCommand.toJSON();