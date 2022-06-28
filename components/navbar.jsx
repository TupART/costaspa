import { Button, Container, Loading } from '@nextui-org/react'
import DarkModeSwitch from './darkModeSwitch'
import { useAuth } from '../services/auth'

export default function Navbar() {
  const { loading, signInWithMicrosoft } = useAuth()

  return (
    <Container>
      <h1>Navbar</h1>
      <DarkModeSwitch />
      <Button onClick={signInWithMicrosoft} loading={loading}>
        {loading ? <Loading /> : 'Sign in with Microsoft'}
      </Button>
    </Container>
  )
}
