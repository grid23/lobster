import { parseArgs } from "@pkgjs/parseargs"

async function main() {
	const {
		positionals: [command],
		values: args,
	} = parseArgs({
		strict: false,
		args: process.argv.slice(2),
		allowPositionals: true,
		options: {},
	})

	console.log(command, args)
	const { default: handler } = await import(`./commands/${command}.js`)
	return handler(args)
}

main()
