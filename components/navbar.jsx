import { Container } from '@nextui-org/react'
import Link from 'next/link'
import DarkModeSwitch from './darkModeSwitch'

export default function Navbar() {
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
      <DarkModeSwitch />
    </Container>
  )
}
