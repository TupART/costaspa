import Link from 'next/link'
import { Text } from '@nextui-org/react'

export default function Logo() {
  return (
    <Link href="/">
      <a>
        <Text
          h3
          css={{
            textGradient: '45deg, $primary -20%, $secondary 50%'
          }}
          weight="bold"
        >
          Helpdesk SPA
        </Text>
      </a>
    </Link>
  )
}
