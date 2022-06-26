import Link from 'next/link'
import { Container } from '@nextui-org/react'

export default function Horas() {
  return (
    <Container>
      <Link href="/horas/json">
        <a>JSON</a>
      </Link>
      <Link href="/horas/csv">
        <a>CSV</a>
      </Link>
    </Container>
  )
}
