/* eslint-disable react/prop-types */
import { Card, useTheme } from '@nextui-org/react'

export default function Task({ time, title, url }) {
  const { isDark } = useTheme()
  const backgroundColor = isDark
    ? time > 0
      ? '$secondary'
      : '$warning'
    : '$white'

  return (
    <a href={url}>
      <Card
        isHoverable
        variant="bordered"
        css={{
          borderColor: time > 0 ? '$secondary' : '$warning',
          backgroundColor
        }}
        borderWeight={time > 0 ? 'normal' : 'bold'}
      >
        <Card.Body
          css={{
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'row',
            paddingBlock: '1rem',
            paddingInline: '2rem',
            alignItems: 'center'
          }}
        >
          <div>{title}</div> <div>{time}</div>
        </Card.Body>
      </Card>
    </a>
  )
}
