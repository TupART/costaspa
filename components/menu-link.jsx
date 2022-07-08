import { Link, Text } from '@nextui-org/react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'

export default function MenuLink({ href, children }) {
  const { pathname } = useRouter()
  const isActive = pathname.startsWith(href)

  return (
    <NextLink href={href}>
      <Text weight={isActive ? 'bold' : 'normal'}>
        <Link css={{ color: '$text' }}>{children}</Link>
      </Text>
    </NextLink>
  )
}
