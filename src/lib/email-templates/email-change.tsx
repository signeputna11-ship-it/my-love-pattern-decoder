import * as React from 'react'
import { Button, Heading, Link, Text } from '@react-email/components'
import { EmailLayout, styles } from './_layout'

interface EmailChangeEmailProps {
  oldEmail: string
  email: string
  newEmail: string
  confirmationUrl: string
}

export const EmailChangeEmail = ({
  oldEmail,
  newEmail,
  confirmationUrl,
}: EmailChangeEmailProps) => (
  <EmailLayout preview="Confirm your email change">
    <Heading style={styles.h1}>Confirm your email change</Heading>
    <Text style={styles.text}>
      You requested to change your My Love Pattern email from{' '}
      <Link href={`mailto:${oldEmail}`} style={styles.link}>{oldEmail}</Link>{' '}
      to{' '}
      <Link href={`mailto:${newEmail}`} style={styles.link}>{newEmail}</Link>.
    </Text>
    <div style={styles.buttonWrap}>
      <Button style={styles.button} href={confirmationUrl}>
        Confirm Change
      </Button>
    </div>
    <Text style={styles.small}>
      If you didn't request this change, please secure your account immediately.
    </Text>
  </EmailLayout>
)

export default EmailChangeEmail
