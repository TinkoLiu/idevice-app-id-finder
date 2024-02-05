# iDevice App ID Finder

A tool for figuring out what Apple ID was used for each apps on an iOS device.

## Summary

This tool can help you find out which Apple ID was used for purchasing all your app, including part of uninstalled app.

## Usage

Install with any package manager you like, for example:

```bash
$ pnpm install -g idevice-app-id-finder
```

Then you can use it like this:

```bash
$ idevice-app-id-finder -h
Usage: idevice-app-id-finder [options] [command]

A tool for figuring out what Apple ID was used for each apps on an iOS device

Options:
  -V, --version   output the version number
  -h, --help      display help for command

Commands:
  devices         Print connected devices
  list [options]  List all apps installed on the device
  help [command]  display help for command
```

If you connect only one device, run it directly:

```bash
$ idevice-app-id-finder
Getting connected devices
Using device Tinko's iPhone
Starting installation proxy service
Listing installed apps...
List installed app finished.
Getting iTunes mainfest
Starting parsing mainfest for 100 apps...
Done, output written to output.csv
```

Output will be like
```csv
Bundle Identifier,Display Name,Apple ID
some.bundle.id,AppName,appleid@somedomain
```

For more options, you can use `idevice-app-id-finder list -h` to get help.

Available options:

```bash
$ idevice-app-id-finder list -h
Usage: idevice-app-id-finder list [options]

List all apps installed on the device

Options:
  -o, --output <file>    Output file (default: ./output.csv)
  -d, --device <device>  Device to use (default: "auto")
  -a, --all              List all apps, including uninstalled apps
  -h, --help             display help for command
```

## Using as library

This package also supports using as a library. See [src/index.ts](src/index.ts) for more details.

## Credits
* [appium/appium-ios-device](https://github.com/appium/appium-ios-device) for fetching files from iDevice
* [TooTallNate/plist.js](https://github.com/TooTallNate/plist.js) for parsing XML style plist files
* [joeferner/node-bplist-parser](https://github.com/joeferner/node-bplist-parser) for parsing binary plist files
* [tj/commander.js](https://github.com/tj/commander.js) for CLI interface
