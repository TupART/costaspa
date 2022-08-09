import { FiArrowLeft } from 'react-icons/fi'
import { Link, Tooltip, Container } from '@nextui-org/react'
import NextLink from 'next/link'

export default function goToButton({
  children,
  href = '/',
  color = 'secondary',
  action,
  doAction = false,
  icon = <FiArrowLeft />,
  iconAfter = false,
  tooltip,
  tooltipPlacement = 'top'
}) {
  const handleClick = () => {
    action(href)
  }

  if (doAction) {
    return (
      <Container css={{ paddingBlock: '$10' }}>
        <Tooltip content={tooltip} placement={tooltipPlacement}>
          <Link
            block
            color={color}
            onClick={handleClick}
            css={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4
            }}
          >
            {iconAfter ? (
              <>
                {children}
                {icon}
              </>
            ) : (
              <>
                {icon}
                {children}
              </>
            )}
          </Link>
        </Tooltip>
      </Container>
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
