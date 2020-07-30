![](http://puu.sh/GbYak/38031ded98.png)

# Open Source - Mugshot

Created by LeonMrBonnie

⭐ This repository if you found it useful!

[![Generic badge](https://img.shields.io/badge/.altv_Installer%3F-Yes!-4E753E.svg)](https://shields.io/)

---

# Description

This repository provides an alt:V resource to show the player holding a mugshot board like in GTA Online.

This resource provides two easy events to start and stop holding the mugshot board.

## Installing Dependencies / Installation

**I cannot stress this enough. Ensure you have NodeJS 13+ or you will have problems.**

-   [NodeJS 13+](https://nodejs.org/en/download/current/)
-   An Existing or New Gamemode
-   General Scripting Knowledge


After simply add the name of this resource to your `server.cfg` resource section.

`altv-os-mugshot`

Then simply clone this repository into your main server resources folder.

```
cd resources
git clone https://github.com/LeonMrBonnie/altv-os-mugshot
```

Ensure your `package.json` includes this property:

```json
"type": "module"
```

# Starting and stopping holding the mugshot board

To start or stop holding the mugshot board for a player you just have to emit the event to the player. You can do this from the clientside or serverside.<br>

| Action    | Event           |
| --------- | --------------- |
| Start     | `mugshot:start` |
| Stop      | `mugshot:stop`  |

Arguments for `mugshot:start`:

| Argument      | Description                         | Type      |
| ------------- | ----------------------------------- | --------- |
| `title`       | The title on the top of the board   | `String`  |
| `topText`     | The text on the top                 | `String`  |
| `midText`     | The text in the middle              | `String`  |
| `bottomText`  | The text on the bottom              | `String`  |
| `rank`        | The rank number on the bottom right | `Number`  |

Example: `alt.emitClient(player, "mugshot:start", "Title", "Top Text", "Mid Text", "Bottom Text", 0);`

Arguments for `mugshot:stop`:<br>
None. The event has no arguments. But the mugshot board has to be activated for it to work, else the event does nothing.

# Other alt:V Open Source Resources

-   [Authentication by Stuyk](https://github.com/Stuyk/altv-os-auth)
-   [Discord Authentication by Stuyk](https://github.com/Stuyk/altv-discord-auth)
-   [Global Blip Manager by Dzeknjak](https://github.com/jovanivanovic/altv-os-global-blip-manager)
-   [Global Marker Manager by Dzeknjak](https://github.com/jovanivanovic/altv-os-global-marker-manager)
-   [Chat by Dzeknjak](https://github.com/jovanivanovic/altv-os-chat)
-   [Nametags by Stuyk](https://github.com/Stuyk/altv-os-nametags)
-   [Entity Sync for JS by LeonMrBonnie](https://github.com/LeonMrBonnie/altv-os-js-entitysync)
-   [Context Menu by Stuyk](https://github.com/Stuyk/altv-os-context-menu)
-   [Global Textlabels by Stuyk](https://github.com/Stuyk/altv-os-global-textlabels)
-   [Interactions by LeonMrBonnie](https://github.com/LeonMrBonnie/altv-os-interactions)
-   [Noclip by LeonMrBonnie](https://github.com/LeonMrBonnie/altv-os-noclip)
-   [Character Editor by Stuyk](https://github.com/Stuyk/altv-os-character-editor)