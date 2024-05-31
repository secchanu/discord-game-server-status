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

import {
	ActivityType,
	Client,
	ClientUser,
	PresenceUpdateStatus,
} from "discord.js";
import { MinecraftServerInfo } from "all-minecraft";

const client = new Client({ intents: [] });
const server = new MinecraftServerInfo({
	serverIp: SERVER_IP,
});

const checkOnline = async (user: ClientUser) => {
	const info = await server.serverInfo();
	if (info) {
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
			activities: [{ name: `サーバーオフライン`, type: ActivityType.Custom }],
		});
	}
};

client.once("ready", async (client) => {
	const user = client.user;
	await checkOnline(user);
	setInterval(() => checkOnline(user), 5 * 60 * 1000);
});

client.login(DISCORD_BOT_TOKEN);
