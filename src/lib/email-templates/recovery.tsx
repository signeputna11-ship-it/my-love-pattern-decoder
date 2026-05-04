import * as React from 'react'
import { Button, Heading, Text } from '@react-email/components'
import { EmailLayout, styles } from './_layout'

interface RecoveryEmailProps {
  siteName: string
  confirmationUrl: string
}

export const RecoveryEmail = ({ confirmationUrl }: RecoveryEmailProps) => (
  <EmailLayout preview="Reset your password for My Love Pattern">
    <Heading style={styles.h1}>Reset your password</Heading>
    <Text style={styles.text}>
      We received a request to reset your password for My Love Pattern. Click the
      button below to choose a new password.
    </Text>
    <div style={styles.buttonWrap}>
      <Button style={styles.button} href={confirmationUrl}>
        Reset Password
      </Button>
    </div>
    <Text style={styles.small}>
      If you didn't request a password reset, you can safely ignore this email — your
      password will not be changed.
    </Text>
  </EmailLayout>
)

export default RecoveryEmail
