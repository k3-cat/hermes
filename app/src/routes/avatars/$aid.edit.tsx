import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/avatars/$aid/edit')({
  component: EditAvatarInfo,
})

function EditAvatarInfo() {
  return <div>Hello "/avaters/$aid/edit"!</div>
}
