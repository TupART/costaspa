import { Button, Container, Loading } from '@nextui-org/react'
import Link from 'next/link'
import DarkModeSwitch from './darkModeSwitch'
import { useAuth } from '../services/auth'

export default function Navbar() {
  const { loading, signInWithMicrosoft } = useAuth()
    
  return (
    <Container
      display="flex"
      justify="space-between"
      alignItems="center"
      css={{ marginBlock: '$10', shadow: '$sm', borderRadius: '$lg' }}
    >
      <div>
        <Link href="/">
          <a>
            <h1>Navbar</h1>
          </a>
        </Link>
      </div>
      <div>
        <ul>
          <li>Home</li>
          <li>
            <Link href="/horas">
              <a>Horas</a>
            </Link>
          </li>
        </ul>
      </div>
      <div>
        <DarkModeSwitch />
        <Button onClick={signInWithMicrosoft} loading={loading}>
          {loading ? <Loading /> : 'Sign in with Microsoft'}
        </Button>
      </div>
    </Container>
  )
}
