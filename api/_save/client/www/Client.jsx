"use client"

import { Suspense, useLayoutEffect } from "react"

import * as components from "./components/components.js"

export default function Client() {
	return (
		<div>
			<Suspense>
				<components.Test />
			</Suspense>
		</div>
	)
}
