import dotenv from "dotenv";
dotenv.config();

const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const SERVER_IP = process.env.SERVER_IP;
if (!DISCORD_BOT_TOKEN) {
	throw new Error("DISCORD_BOT_TOKEN is not set");
}
if (!SERVER_IP) {
	throw new Error("SERVER_IP is not set");
}

import { Client, type ClientUser } from "discord.js";
import { ActivityType, PresenceUpdateStatus } from "discord-api-types/v10";
import { MinecraftServerInfo } from "all-minecraft";

const client = new Client({ intents: [] });
const server = new MinecraftServerInfo({
	serverIp: SERVER_IP,
});

const checkOnline = async (user: ClientUser) => {
	const info = await server.serverInfo();
	if (info.online) {
		const online = info.players.now;
		user.setPresence({
			status: online ? PresenceUpdateStatus.Online : PresenceUpdateStatus.Idle,
			activities: [
				{
					name: `${online}人がMinecraft`,
					type: ActivityType.Playing,
				},
			],
		});
	} else {
		user.setPresence({
			status: PresenceUpdateStatus.DoNotDisturb,
			activities: [{ name: "サーバーオフライン", type: ActivityType.Custom }],
		});
	}
};

client.once("ready", async (client) => {
	const user = client.user;
	await checkOnline(user);
	setInterval(() => checkOnline(user), 1 * 60 * 1000);
});

client.login(DISCORD_BOT_TOKEN);
