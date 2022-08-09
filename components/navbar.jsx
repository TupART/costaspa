import { Container, Grid } from '@nextui-org/react'
import DarkModeSwitch from './darkModeSwitch'
import User from '../components/user'
import MenuLink from './menu-link'
import Logo from './logo'

export default function Navbar() {
  return (
    <Container>
      <Grid.Container
        justify="space-between"
        alignItems="center"
        css={{
          marginBlock: '$10',
          paddingBlock: '$4',
          paddingInline: '$10',
          shadow: '$sm',
          borderRadius: '$lg'
        }}
      >
        <Grid>
          <Logo />
        </Grid>
        <Grid css={{ display: 'inline-flex', gap: '$10' }}>
          <MenuLink href="/horas">Horas</MenuLink>
          <MenuLink href="/excel">Excel</MenuLink>
          <MenuLink href="/tareas">Tareas</MenuLink>
        </Grid>
        <Grid css={{ display: 'flex', alignItems: 'center', gap: '$6' }}>
          <DarkModeSwitch />
          <User />
        </Grid>
      </Grid.Container>
    </Container>
  )
}
