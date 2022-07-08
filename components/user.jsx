import { User as UserNextUI, Button } from '@nextui-org/react'
import { useState } from 'react'
import { useAuth } from '../services/auth'

export default function User() {
  const [open, setOpen] = useState(false)
  const { user, signInWithMicrosoft, signout } = useAuth()

  const handleClick = () => setOpen(!open)

  const handleLogin = () => {
    signInWithMicrosoft()
  }

  const handleLogout = () => {
    signout()
  }

  return user ? (
    <>
      <UserNextUI
        src={user?.photoUrl || '/static/images/user.png'}
        name={user?.name || 'Sin usuario'}
        description={user?.email || 'Helpdesk'}
        onClick={handleClick}
      />
      <Button onClick={handleLogout}>Cerrar sesión</Button>
    </>
  ) : (
    <Button onClick={handleLogin}>login</Button>
  )
}
