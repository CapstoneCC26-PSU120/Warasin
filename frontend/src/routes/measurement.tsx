import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/measurement')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/measurement"!</div>
}
