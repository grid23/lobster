import { spawn } from "node:child_process"
import process from "node:process"

import compose from "../compose.js"

export default async (options, env) =>
	new Promise(async resolve => {
		const fileArgs = []
		for await (const files of compose(options, env)) fileArgs.push(...files)
		const command = ["docker", ["compose", ...fileArgs, "down"]]
		process.stdout.write(`Will attempt this command ▶\n${command.flat().join(" ")}\n\n`)
		const cp = spawn(...command, { stdio: "inherit", env: Object.assign(process.env, env) })
		cp.once("close", resolve)
	})
