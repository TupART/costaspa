import { useAuth } from '../../services/auth'
import { useTask } from '../../services/task'
import { Button } from '@nextui-org/react'
import { useMe } from '../../services/user'

export default function Tareas() {
  const { user } = useAuth()
  const { task, getTasks } = useTask()

  const me = useMe()
  console.log(me)

  const handleGetTasks = () => {
    getTasks()
  }

  console.log({ user, task })
  return (
    <>
      <div>
        <h1>Tareas</h1>
        {user && <p>{user.uid}</p>}
        {user && <p>{user.email}</p>}
        {user && <p>{user.displayName}</p>}
        {user && <p>{user.photoURL}</p>}
        {user && <p>{user.providerData}</p>}
      </div>
      <Button onClick={handleGetTasks}>Get tasks</Button>
    </>
  )
}
