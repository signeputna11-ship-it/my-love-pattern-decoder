import * as React from 'react'
import { Button, Heading, Text } from '@react-email/components'
import { EmailLayout, styles } from './_layout'

interface RecoveryEmailProps {
  confirmationUrl: string
  email: string
}

export const RecoveryEmail = ({ confirmationUrl }: RecoveryEmailProps) => (
  <EmailLayout preview="Reset your My Love Pattern password">
    <Heading style={styles.h1}>Reset your password</Heading>
    <Text style={styles.text}>
      We received a request to reset the password on your My Love Pattern account.
      Click the button below to choose a new one.
    </Text>
    <div style={styles.buttonWrap}>
      <Button style={styles.button} href={confirmationUrl}>
        Reset Password
      </Button>
    </div>
    <Text style={styles.small}>
      If you didn't request a password reset, you can ignore this email and your password will stay the same.
    </Text>
  </EmailLayout>
)

export default RecoveryEmail
