const {
    Client,
    GatewayIntentBits,
    Partials,
    REST,
    Routes,
    SlashCommandBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder,
    ButtonBuilder,
    ButtonStyle,
} = require("discord.js");

require("dotenv").config();

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

const client = new Client({
    intents: [GatewayIntentBits.Guilds],
    partials: [Partials.Channel],
});

// REGISTRAR COMANDO
const commands = [
    new SlashCommandBuilder()
        .setName("rataspe")
        .setDescription("Menú privado de información Rataspe")
        .toJSON(),
];

const rest = new REST({ version: "10" }).setToken(TOKEN);

(async () => {
    try {
        await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
            body: commands,
        });
        console.log("Comando /rataspe registrado correctamente.");
    } catch (err) {
        console.log(err);
    }
})();

// CREAR MENÚ PRINCIPAL
function crearMenu() {
    const menu = new StringSelectMenuBuilder()
        .setCustomId("menu_rataspe")
        .setPlaceholder("Selecciona una opción…")
        .addOptions(
            {
                label: "📡IP del servidor📡",
                value: "ip",
            },
            {
                label: "📦Recursos para entrar📦",
                value: "recursos",
            },
        );

    return new ActionRowBuilder().addComponents(menu);
}

// BOTÓN VOLVER
function botonVolver() {
    return new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("volver_menu")
            .setLabel("Volver al menú")
            .setStyle(ButtonStyle.Primary),
    );
}

client.on("interactionCreate", async (interaction) => {
    // EJECUTAR /rataspe
    if (interaction.isChatInputCommand()) {
        if (interaction.commandName === "rataspe") {
            await interaction.reply({
                content: "**📝Selecciona una opción del menú:**",
                components: [crearMenu()],
                ephemeral: true,
            });
        }
    }

    // MANEJO DEL MENÚ SELECT
    if (interaction.isStringSelectMenu()) {
        if (interaction.customId === "menu_rataspe") {
            // OPCIÓN IP
            if (interaction.values[0] === "ip") {
                await interaction.update({
                    content: "**📡IP de RATASPE📡**\n``````",
                    components: [botonVolver()],
                });
            }

            // OPCIÓN RECURSOS
            if (interaction.values[0] === "recursos") {
                // BOTÓN DE DESCARGA
                const botonDescarga = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setLabel("📥Descargar Recursos")
                        .setStyle(ButtonStyle.Link)
                        .setURL("https://www.mediafire.com/file/i4wm1gg4p0hlobj/Recursos.zip/file"),
                );

                await interaction.update({
                    content: "🔎Versión: **1.20.1-FORGE-47.4.10**",
                    components: [
                        botonDescarga, // 🔼 primer botón (descargar)
                        botonVolver(), // 🔽 segundo botón (volver)
                    ],
                });
            }
        }
    }

    // BOTÓN VOLVER
    if (interaction.isButton()) {
        if (interaction.customId === "volver_menu") {
            await interaction.update({
                content: "**Selecciona una opción del menú:**",
                components: [crearMenu()],
            });
        }
    }
});

client.login(TOKEN);
