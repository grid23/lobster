export default async function build({ args }) {
	return Promise.all([
		Bun.build({
			entrypoints: ["./client/worker/index.js"],
			outdir: "./build",
			splitting: false,
			manifest: true,
			naming: "[dir]/shared-worker-[hash].[ext]",
			minify: process.env.NODE_ENV !== "development",
			external: [],
		}),
		Bun.build({
			entrypoints: ["./client/www/index.js"],
			outdir: "./build",
			splitting: true,
			naming: {
				entry: "[dir]/[name]-[hash].[ext]",
				chunk: "[name]-[hash].[ext]",
				asset: "[name]-[hash].[ext]",
			},
			manifest: true,
			minify: process.env.NODE_ENV !== "development",
			publicPath: "/api",
			external: [],
		}),
	]).then(([worker, www]) => {
		console.log("buildOutputs:", [worker, www])
		return {
			worker,
			www,
		}
	})
}
