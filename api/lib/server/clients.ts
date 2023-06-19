export class Clients extends Set {
	broadcast() {}
}

export default async function createClients(db, { args }) {
	return new Clients()
}
