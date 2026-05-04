import * as React from 'react'
import { Button, Heading, Text } from '@react-email/components'
import { EmailLayout, styles } from './_layout'

interface SignupEmailProps {
  confirmationUrl: string
  email: string
}

export const SignupEmail = ({ confirmationUrl, email }: SignupEmailProps) => (
  <EmailLayout preview="Confirm your email for My Love Pattern">
    <Heading style={styles.h1}>Welcome to My Love Pattern</Heading>
    <Text style={styles.text}>
      Hi {email},
    </Text>
    <Text style={styles.text}>
      Thanks for signing up. Please confirm your email address to start your reset journey.
    </Text>
    <div style={styles.buttonWrap}>
      <Button style={styles.button} href={confirmationUrl}>
        Confirm Email
      </Button>
    </div>
    <Text style={styles.small}>
      If you didn't create this account, you can safely ignore this email.
    </Text>
  </EmailLayout>
)

export default SignupEmail
