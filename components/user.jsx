import { Button, Container, Link, User as UserNextUI } from '@nextui-org/react'

import { TbLogout } from 'react-icons/tb'
import { useAuth } from '../services/auth'
import { useState } from 'react'

export default function User({ name, photoUrl, children }) {
  const [open, setOpen] = useState(false)
  const handlePress = () => setOpen(!open)
  const { user, signInWithMicrosoft, signOut } = useAuth()
  console.log(user)
  const handleClick = () => {
    signInWithMicrosoft()
  }

  return user ? (
    <Container as="div" css={{ display: 'flex', alignItems: 'center' }}>
      <UserNextUI
        src={user?.photoUrl || '/static/images/user.png'}
        name={user?.name || 'Usuário'}
        description="UI/UX Designer @Github"
        onPress={handlePress}
      />
      <Link block color="text" onClick={signOut}>
        <TbLogout />
      </Link>
    </Container>
  ) : (
    <Button onClick={handleClick}>login</Button>
  )
}
