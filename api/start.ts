import { parseArgs } from "@pkgjs/parseargs"

async function main() {
	const {
		positionals: [command],
	} = parseArgs({
		strict: false,
		args: process.argv.slice(2),
		allowPositionals: true,
	})

	const { values: args } = parseArgs({
		strict: false,
		args: process.argv.slice(2),
		allowPositionals: true,
		options: {
			broker: {
				type: "boolean",
				default: command === "dev",
			},
			test: {
				type: "boolean",
				default: command === "dev",
			},
			ws: {
				type: "boolean",
				default: command === "dev",
			},
		},
	})

	const { default: handler } = await import(`cmd/${command}.js`)
	return handler(args)
}

main().catch((err: Error) => {
	console.error(err)
	process.exit(0)
})
