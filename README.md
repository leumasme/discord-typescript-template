### Creating Commands

To introduce a new command, simply create a new .ts file inside the /src/commands/ folder.
This file should export an Object that matches the Command interface.

Here is a Boilerplate Ping command to copy and modify:
```typescript
import { ChannelTarget, Command, Permission } from "../commandLoader"
export default ({
    "name": "ping",
    "description": "Responds to you!",
    "execute": (msg, args) => { msg.channel.send("Hello!") },
    "permissions": Permission.Anyone,
    "alias": ["pong"],
    "channels": ChannelTarget.Any
} as Command)
```