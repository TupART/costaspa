import { FiArrowLeft } from 'react-icons/fi'
import { Link, Tooltip } from '@nextui-org/react'
import NextLink from 'next/link'

export default function goToButton({
  children,
  href = '/',
  color = 'secondary',
  action,
  doAction = false,
  icon = <FiArrowLeft />,
  tooltip,
  tooltipPlacement = 'top'
}) {
  const handleClick = () => {
    action(href)
  }

  if (doAction) {
    return (
      <Tooltip content={tooltip} placement={tooltipPlacement}>
        <Link
          block
          color={color}
          onClick={handleClick}
          css={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
        >
          {icon}
          {children}
        </Link>
      </Tooltip>
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
