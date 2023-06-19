import connectRDB from "rdb/connectRDB";

export default async function health(req, server, { args, db }) {
  const body = JSON.stringify({
    rdb: {
      open: db.isOpen
    }
  })

  return new Response(body, {
    status: 200,
    headers: new Headers({
      "Content-Type": "application/json",
      "Content-Length": new TextEncoder().encode(body).length.toString()
    })
  })
}