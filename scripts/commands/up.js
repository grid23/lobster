import { spawn } from "node:child_process"
import process from "node:process"

import compose from "../compose.js"

async function cp(files, args, env) {
	if (files.length)
		return new Promise(resolve => {
			const command = ["docker", ["compose", ...files, "-p", env.name, "up", "-d", args.build && "--build"].filter(Boolean)]
			process.stdout.write(`Will attempt this command ▶\n${command.flat().join(" ")}\n\n`)

			spawn(...command, { stdio: "inherit", env: Object.assign({}, process.env, env) }).once("close", resolve)
		})
}

export default async function dev(args, env) {
	for await (const files of compose(args, env)) await cp(files, args, env)
}
