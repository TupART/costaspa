import { FiArrowLeft } from 'react-icons/fi'
import { Link } from '@nextui-org/react'
import NextLink from 'next/link'

export default function goToButton({
  children,
  href = '/',
  color = 'secondary',
  action,
  doAction = false
}) {
  const handleClick = () => {
    action(href)
  }

  if (doAction) {
    return (
      <Link
        block
        color={color}
        onClick={handleClick}
        css={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
      >
        <FiArrowLeft />
        {children}
      </Link>
    )
  }
  return (
    <NextLink href={href}>
      <Link block color={color}>
        <FiArrowLeft />
        {children}
      </Link>
    </NextLink>
  )
}
