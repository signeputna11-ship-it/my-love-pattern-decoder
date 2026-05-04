import * as React from 'react'
import { Button, Heading, Link, Text } from '@react-email/components'
import { EmailLayout, styles } from './_layout'

interface SignupEmailProps {
  siteName: string
  siteUrl: string
  recipient: string
  confirmationUrl: string
}

export const SignupEmail = ({
  siteName,
  siteUrl,
  recipient,
  confirmationUrl,
}: SignupEmailProps) => (
  <EmailLayout preview={`Confirm your email for ${siteName}`}>
    <Heading style={styles.h1}>Confirm your email</Heading>
    <Text style={styles.text}>
      Thanks for joining{' '}
      <Link href={siteUrl} style={styles.link}>
        <strong>My Love Pattern</strong>
      </Link>
      . Please confirm your email address ({recipient}) to activate your account
      and access your reset.
    </Text>
    <div style={styles.buttonWrap}>
      <Button style={styles.button} href={confirmationUrl}>
        Verify Email
      </Button>
    </div>
    <Text style={styles.small}>
      If you didn't create an account, you can safely ignore this email.
    </Text>
  </EmailLayout>
)

export default SignupEmail
