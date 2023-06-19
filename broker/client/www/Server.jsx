import path from "node:path"

import Client from "./Client.jsx"

export default async function Server(props) {
	const prefix = props?.req?.headers?.get?.("x-forwarded-prefix") ?? ""
	const worker = prefix + props?.build?.worker?.outputs?.[0]?.path?.replace?.(path.resolve(process.cwd(), "./build"), "")
	const bundle = prefix + props?.build?.www?.outputs?.[0]?.path?.replace?.(path.resolve(process.cwd(), "./build"), "")
	const style = props?.build?.www?.outputs?.filter?.(artifact => {
		return path.extname(artifact.path) === ".css"
	})
	return (
		<html>
			<head>
				<meta charSet='UTF-8' />
				<title>test</title>
				{style?.map?.(artifact => {
					const href = prefix + artifact.path.replace(path.resolve(process.cwd(), "./build"), "")
					return <link href={href} rel='stylesheet' />
				})}
			</head>
			<body>
				<div id='root'>
					<Client />
				</div>
				<script src={worker} type='module' />
				<script src={bundle} type='module' />
			</body>
		</html>
	)
}
