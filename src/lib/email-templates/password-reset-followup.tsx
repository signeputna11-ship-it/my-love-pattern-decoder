import * as React from 'react'
import { Heading, Text } from '@react-email/components'
import { EmailLayout, styles } from './_layout'
import type { TemplateEntry } from './registry'

const PasswordResetFollowupEmail = () => (
  <EmailLayout preview="Your password was updated">
    <Heading style={styles.h1}>Your password was updated</Heading>
    <Text style={styles.text}>
      This is a confirmation that the password for your My Love Pattern account was just changed.
    </Text>
    <Text style={styles.small}>
      If this wasn't you, please reset your password again immediately and contact us by replying to this email.
    </Text>
  </EmailLayout>
)

export const template = {
  component: PasswordResetFollowupEmail,
  subject: 'Your password was updated',
  displayName: 'Password reset followup',
  previewData: {},
} satisfies TemplateEntry

export default PasswordResetFollowupEmail
