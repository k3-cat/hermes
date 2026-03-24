import { FC } from "hono/jsx";

export const ResourcesMenu: FC<{ sub: string; ver: string; manifest: [string, string][] }> = (props) => {
	return (
		<>
			<h1>{`${props.sub} (${props.ver})`}</h1>
			<div>
				{props.manifest.map(([platform, url]) => (
					<p>
						<a href={url}>{platform}</a>
					</p>
				))}
			</div>
		</>
	);
};
