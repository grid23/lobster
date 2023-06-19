import fs from "node:fs/promises"
import path from "node:path"

import dotenv from "dotenv"

export default async options =>
	fs
		.readFile(path.resolve(process.cwd(), "./package.json"), "utf-8")
		.then(body => JSON.parse(body))
		.then(packagejson => [
			packagejson,
			packagejson.env_files
				.filter(file => {
					file = Array.isArray(file) ? file : [file]
					const [, constrains] = file

					for (const [key, value] of Object.entries(constrains ?? [])) if (!!options[key] !== value) return false
					return true
				})
				.map(file => (Array.isArray(file) ? file[0] : file)),
		])
		.then(([packagejson, files]) =>
			Promise.all([
				Promise.resolve({ compose: packagejson.compose, name: packagejson.name, version: packagejson.version }),
				Promise.resolve(packagejson.env),
				...files.map(filepath =>
					fs
						.readFile(path.resolve(process.cwd(), filepath), "utf-8")
						.then(body => dotenv.parse(body))
						.catch(err => {
							if (err.code !== "ENOENT") console.error(err)
						})
				),
			]).then(([packagejson, ...envs]) => Object.assign(packagejson, ...envs.filter(Boolean)))
		)
		.catch(err => console.error(err))
