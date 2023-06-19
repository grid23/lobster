import { spawn } from "node:child_process"
import fs from "node:fs/promises"
import path from "node:path"
import process from "node:process"
import { parseArgs } from "node:util"

import envVar from "./env.js"

const main = async () => {
	const { values: args } = parseArgs({
		strict: true,
		allowPositionals: false,
		options: {
			subdomains: {
				type: "string",
				default: "www",
			},
			key: {
				type: "string",
			},
			cert: {
				type: "string",
			},
		},
	})

	const env = await envVar(args)

	const folders = ((key, cert) => [...new Set([key, cert])])(path.dirname(path.resolve(args.key)), path.dirname(path.resolve(args.cert)))
	for (const folder of folders) {
		await fs.mkdir(folder).catch(err => {
			if (err.code !== "EEXIST") {
				console.error(err)
				process.exit(1)
			}
		})
	}

	const subdomains = args.subdomains.split(",")
	const hostnames = (env.HOSTNAME ?? "localhost").split("|")
	const ltds = env.LTD?.split?.("|")

	const cartesianProduct = []
	for (const a of subdomains)
		for (const b of hostnames)
			for (const c of ltds) {
				if (a.startsWith("*")) {
					const alt = a.replace(/^(\*\.?)/, "")
					const product = [alt, b, c].filter(Boolean).join(".")
					cartesianProduct.push(product)
				}

				const product = [a, b, c].filter(Boolean).join(".")
				cartesianProduct.push(product)
			}

	const keyFile = args.key ? ["-key-file", args.key] : []
	const certFile = args.cert ? ["-cert-file", args.cert] : []

	const command = ["mkcert", [...keyFile, ...certFile, ...cartesianProduct]]
	process.stdout.write(`Will attempt this command ▶\n${command.flat().join(" ")}\n`)
	const cp = spawn(...command, { stdio: "inherit" })

	cp.once("close", () => {
		process.stdout.write(`Don't forget to set your hosts file ℹ️\n`)
		for (const product of cartesianProduct) process.stdout.write(`::1\t${product}\n`)
	})
}

main()
