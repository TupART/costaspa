import { User as UserNextUI, Button } from '@nextui-org/react'
import { useState } from 'react'
import { useAuth } from '../services/auth'

export default function User({ name, photoUrl, children }) {
  const [open, setOpen] = useState(false)
  const handlePress = () => setOpen(!open)
  const { user } = useAuth()

  return user ? (
    <>
      <UserNextUI
        src={user?.photoUrl || '/static/images/user.png'}
        name={user?.name || 'Usuário'}
        description="UI/UX Designer @Github"
        onPress={handlePress}
      />
      <div>{open}</div>
    </>
  ) : (
    <Button>login</Button>
  )
}
