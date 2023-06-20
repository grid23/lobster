import { renderToReadableStream } from "react-dom/server"

export default async function test(req, server, db, args: Argv) {
	if (!args.test) {
		throw { status: 404 }
	}

	const stream = await renderToReadableStream(
		<html>
			<head>
				<title></title>
				<meta charSet='UTF-8' />
				<style>{`
					body {
						background: #2b2b2b;
						color: #ececec;
					}
				`}</style>
			</head>
			<body>
				<h1>console</h1>
				<ul id='entries'></ul>
			</body>
		</html>,
		{
			bootstrapScripts: [`${process.env.BASEPATH}/test.js`],
		}
	)

	return new Response(stream, {
		status: 200,
		headers: new Headers({ "Content-type": "text/html" }),
	})
}
