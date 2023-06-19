import * as ReactDOM from "react-dom/client"

import Client from "./Client.jsx"

async function main() {
	ReactDOM.hydrateRoot(document.getElementById("root"), <Client />)
}

main()
