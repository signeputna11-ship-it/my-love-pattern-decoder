import * as React from 'react'
import { Button, Heading, Text } from '@react-email/components'
import { EmailLayout, styles } from './_layout'
import type { TemplateEntry } from './registry'

interface CourseNotificationProps {
  title?: string
  body?: string
  ctaUrl?: string
  ctaLabel?: string
}

const CourseNotificationEmail = ({
  title,
  body,
  ctaUrl,
  ctaLabel,
}: CourseNotificationProps) => (
  <EmailLayout preview={title ?? 'A new update on your reset path'}>
    <Heading style={styles.h1}>{title ?? 'A new update on your reset path'}</Heading>
    <Text style={styles.text}>
      {body ?? 'There is something new waiting for you in your reset.'}
    </Text>
    {ctaUrl ? (
      <div style={styles.buttonWrap}>
        <Button style={styles.button} href={ctaUrl}>
          {ctaLabel ?? 'Open My Reset'}
        </Button>
      </div>
    ) : null}
    <Text style={styles.small}>
      You're receiving this because you have access to My Love Pattern.
    </Text>
  </EmailLayout>
)

export const template = {
  component: CourseNotificationEmail,
  subject: (data: Record<string, any>) =>
    typeof data.title === 'string' && data.title ? data.title : 'A new update on your reset path',
  displayName: 'Course notification',
  previewData: {
    title: 'A new module is open: Boundaries',
    body: 'Your next step in the reset is ready. Take 10 quiet minutes when you can.',
    ctaUrl: 'https://mylovepattern.com/app',
    ctaLabel: 'Open Module',
  },
} satisfies TemplateEntry

export default CourseNotificationEmail
