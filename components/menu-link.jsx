import { Link } from '@nextui-org/react'
import NextLink from 'next/link'

export default function MenuLink({ href, children }) {
  return (
    <NextLink href={href}>
      <Link>
        <a>{children}</a>
      </Link>
    </NextLink>
  )
}
