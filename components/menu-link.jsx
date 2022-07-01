import { Link, Text } from '@nextui-org/react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'

export default function MenuLink({ href, children }) {
  const { pathname } = useRouter()
  console.log(pathname)
  const isActive = pathname.startsWith(href)
  const css = isActive ? { color: '$primary' } : { color: '$secondary' }
  return (
    <NextLink href={href}>
      <Text weight={isActive ? 'bold' : 'normal'}>
        <Link css={css}>{children}</Link>
      </Text>
    </NextLink>
  )
}
