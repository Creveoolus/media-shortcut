const { Plugin } = require('powercord/entities');
const { channels, getModule } = require("powercord/webpack"); // You need React, so we Import it here
const fs = require('fs');

const Settings = require("./components/settings.jsx"); // get the path to your Settings file
const mime_types = require("./components/mimetypes")

module.exports = class MediaShortcut extends Plugin {
	async startPlugin() {
		powercord.api.settings.registerSettings(this.entityID, {
			category: this.entityID,
			label: 'Media Shortcuts',
			render: Settings
		});

		const { promptToUpload } = await getModule(["promptToUpload"]);
		const { getUser } = await getModule(["getUser"]);
		const { getChannel } = await getModule(["getChannel", "hasChannel"]);

		powercord.api.commands.registerCommand({
			command: "sendmedia",
			aliases: ["sm"],
			description: "Sends an media",
			usage: "<SHORTCUT>",
			autocomplete: this.image_autocomplete.bind(this),
			executor: async ([shortcut]) => {
				const mediaPath = this.settings.get("mediaDirectory",  __dirname + '\\media\\');

				if (shortcut == null || shortcut == " ") {
					return {
						send: false,
						result: "**Please specify the shortcut name!**"
					};
				} else {
					let files = fs.readdirSync(mediaPath);
					let filesLenght = files.length;
					let antiDeadAssBitchShowingUp;

					for (let i = 0; i < filesLenght; i++) {
						if (files[i].startsWith(shortcut)) {
							let type = this.get_mime(files[i]);
							antiDeadAssBitchShowingUp = 1;

							fs.readFile(mediaPath+files[i], function(err, buffer){
								if (err === null) {
									let file = new File([buffer], files[i], { type: type });
									promptToUpload([file], getChannel(channels.getChannelId()), 0);
									return;
								} else {
									return {
										send: false,
										result: "`" + shortcut + "` wasn't found!"
									}
								}
							});
							break;
						}
					};
					
					if (antiDeadAssBitchShowingUp === undefined) {
						return {
							send: false,
							result: "`" + shortcut + "` wasn't found!"
						};
					}
				};
			}
		});
	}
	pluginWillUnload() {
		powercord.api.commands.unregisterCommand('sendmedia');
		powercord.api.settings.unregisterSettings(this.entityID);
	}

	image_autocomplete(args) {
		args = args.join(" ");

		let allFiles = fs.readdirSync(this.settings.get("mediaDirectory",  __dirname + '\\media\\'));
		let files = [...allFiles]
			.filter((name) => {name = name.toLowerCase();return name.startsWith(args)})
			.map((name) => ({ command: name }))

		return {
			commands: files,
			header: 'media list',
		};
	};

	get_mime(name) { // For some reason, I had to do this... not sure why
        return mime_types(name).toString();
    }
}
