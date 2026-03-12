import { Style } from "hono/css";
import type { FC } from "hono/jsx";

export const Layout: FC = (props) => {
	return (
		<html>
			<head>
				<meta charset="UTF-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<link rel="icon" href="/favicon.ico" type="image/x-icon" />
				<title>{props.title}</title>
				<Style />
				<link rel="stylesheet" href="/style.css" />
			</head>
			<body>{props.children}</body>
		</html>
	);
};
