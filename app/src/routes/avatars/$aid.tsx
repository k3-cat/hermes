import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/avatars/$aid')({
  component: AvatarDetail,
})

function AvatarDetail() {
  return <div>Hello "/avatars/$aid"!</div>
}
