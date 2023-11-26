oclif-hello-world
=================

oclif example Hello World CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main)
[![GitHub license](https://img.shields.io/github/license/oclif/hello-world)](https://github.com/oclif/hello-world/blob/main/LICENSE)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g _cli
$ smith COMMAND
running command...
$ smith (--version)
_cli/0.0.0 darwin-arm64 node-v18.18.0
$ smith --help [COMMAND]
USAGE
  $ smith COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`smith hello PERSON`](#smith-hello-person)
* [`smith hello world`](#smith-hello-world)
* [`smith help [COMMANDS]`](#smith-help-commands)
* [`smith plugins`](#smith-plugins)
* [`smith plugins:install PLUGIN...`](#smith-pluginsinstall-plugin)
* [`smith plugins:inspect PLUGIN...`](#smith-pluginsinspect-plugin)
* [`smith plugins:install PLUGIN...`](#smith-pluginsinstall-plugin-1)
* [`smith plugins:link PLUGIN`](#smith-pluginslink-plugin)
* [`smith plugins:uninstall PLUGIN...`](#smith-pluginsuninstall-plugin)
* [`smith plugins reset`](#smith-plugins-reset)
* [`smith plugins:uninstall PLUGIN...`](#smith-pluginsuninstall-plugin-1)
* [`smith plugins:uninstall PLUGIN...`](#smith-pluginsuninstall-plugin-2)
* [`smith plugins update`](#smith-plugins-update)

## `smith hello PERSON`

Say hello

```
USAGE
  $ smith hello PERSON -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Who is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ oex hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [src/commands/hello/index.ts](https://github.com/nuxt-monorepo/_cli/blob/v0.0.0/src/commands/hello/index.ts)_

## `smith hello world`

Say hello world

```
USAGE
  $ smith hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ smith hello world
  hello world! (./src/commands/hello/world.ts)
```

_See code: [src/commands/hello/world.ts](https://github.com/nuxt-monorepo/_cli/blob/v0.0.0/src/commands/hello/world.ts)_

## `smith help [COMMANDS]`

Display help for smith.

```
USAGE
  $ smith help [COMMANDS] [-n]

ARGUMENTS
  COMMANDS  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for smith.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.2.20/src/commands/help.ts)_

## `smith plugins`

List installed plugins.

```
USAGE
  $ smith plugins [--json] [--core]

FLAGS
  --core  Show core plugins.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ smith plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.1.5/src/commands/plugins/index.ts)_

## `smith plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ smith plugins add plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -s, --silent   Silences yarn output.
  -v, --verbose  Show verbose yarn output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ smith plugins add

EXAMPLES
  $ smith plugins:install myplugin 

  $ smith plugins:install https://github.com/someuser/someplugin

  $ smith plugins:install someuser/someplugin
```

## `smith plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ smith plugins inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ smith plugins:inspect myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.1.5/src/commands/plugins/inspect.ts)_

## `smith plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ smith plugins install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -s, --silent   Silences yarn output.
  -v, --verbose  Show verbose yarn output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ smith plugins add

EXAMPLES
  $ smith plugins:install myplugin 

  $ smith plugins:install https://github.com/someuser/someplugin

  $ smith plugins:install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.1.5/src/commands/plugins/install.ts)_

## `smith plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ smith plugins link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help          Show CLI help.
  -v, --verbose
      --[no-]install  Install dependencies after linking the plugin.

DESCRIPTION
  Links a plugin into the CLI for development.
  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ smith plugins:link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.1.5/src/commands/plugins/link.ts)_

## `smith plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ smith plugins remove plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ smith plugins unlink
  $ smith plugins remove
```

## `smith plugins reset`

Remove all user-installed and linked plugins.

```
USAGE
  $ smith plugins reset
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.1.5/src/commands/plugins/reset.ts)_

## `smith plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ smith plugins uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ smith plugins unlink
  $ smith plugins remove
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.1.5/src/commands/plugins/uninstall.ts)_

## `smith plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ smith plugins unlink plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ smith plugins unlink
  $ smith plugins remove
```

## `smith plugins update`

Update installed plugins.

```
USAGE
  $ smith plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.1.5/src/commands/plugins/update.ts)_
<!-- commandsstop -->
