
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

	const { default: handler } = await import(`cmd/${command}.js`)
	return handler(args)
}

main()
	.catch(err => {
		console.error(err)
		process.exit(0)
	})
