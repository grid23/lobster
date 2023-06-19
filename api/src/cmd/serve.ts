import path from "node:path"

function getFiletype(pathname, { args, build }) {
	return path.extname(pathname) || ".html"
}

async function _404(req, server, { args, build }) {
	return new Response("missing", { status: 404 })
}

const basePathRegExp = new RegExp(`^${process.env.BASEPATH??""}`)
export default async function serve({ args, db }) {
  const router = new Bun.FileSystemRouter({
    style: "nextjs",
    dir: "src/app"
  })

  return Bun.serve({
    development: process.env.NODE_ENV === "development",
    port: 80,
    async fetch(req, server){
      const url = new URL(req.url)
      const pathname = url.pathname.replace(basePathRegExp, "")
      const match = router.match(pathname)
      console.log(match, router, pathname)
      const { default: handler = _404 } = match ? await import(match.filePath) : {}
      return handler(req, server, { args, db })
    }
  })
}