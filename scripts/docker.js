import util from "node:util"

import envVar from "./env.js"

const main = async () => {
	const {
		positionals: [command],
		values: args,
	} = util.parseArgs({
		strict: true,
		allowPositionals: true,
		options: {
			build: {
				type: "boolean",
			},
			connected: {
				type: "boolean",
			},
			dev: {
				type: "boolean",
			},
		},
	})
	const env = await envVar(args)
	return import(`./commands/${command}.js`)
		.then(({ default: handler }) => handler(args, env))
		.catch(err => {
			console.error(err)
			process.exit(1)
		})
}

main()
