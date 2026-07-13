import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/avatars/")({
	component: AvatarList,
});

function AvatarList() {
	return <div>Hello "/avaters/"!</div>;
}
