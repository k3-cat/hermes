import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$name')({
	component: AvatarDetail,
})

function AvatarDetail() {
	return <div>Hello "/avatars/$aid"!</div>
}
