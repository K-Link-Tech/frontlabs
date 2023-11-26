import { Args, Command } from "@oclif/core"
import chalk from "chalk"
import ora from "ora"
import path from "path"

export default class CreateApp extends Command {
	static description = "Create new Application"

	static examples = ["<%= config.bin %> <%= command.id %>"]

	static flags = {}

	static args = {
		name: Args.string({ description: "name of the application" }),
	}

	public async run(): Promise<void> {
		const { args } = await this.parse(CreateApp)

		console.log(process.argv)
		const repo_root_dir = path.dirname(process.cwd())
		console.log(chalk.bgBlue(` ${repo_root_dir} `))

		const spinner = ora({ spinner: "aesthetic" }).start(args.name)
		setTimeout(() => spinner.stop(), 3000)
	}
}
