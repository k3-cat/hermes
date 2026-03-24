import { jsxRenderer } from "hono/jsx-renderer";
import { Link, ViteClient } from "vite-ssr-components/hono";

import { HonoCtx } from "../schemas/hono-ctx";

export const renderer = jsxRenderer<HonoCtx>(({ children, title }) => {
	return (
		<html>
			<head>
				<meta charset="UTF-8" />
				<ViteClient />
				<Link href="/src/style.css" rel="stylesheet" />
				<title>{title}</title>
			</head>
			<body>{children}</body>
		</html>
	);
});
