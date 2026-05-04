import * as React from 'react'
import { Button, Heading, Text } from '@react-email/components'
import { EmailLayout, styles } from './_layout'

interface MagicLinkEmailProps {
  confirmationUrl: string
  email: string
}

export const MagicLinkEmail = ({ confirmationUrl }: MagicLinkEmailProps) => (
  <EmailLayout preview="Your sign-in link for My Love Pattern">
    <Heading style={styles.h1}>Your sign-in link</Heading>
    <Text style={styles.text}>
      Click the button below to sign in to My Love Pattern. This link expires shortly.
    </Text>
    <div style={styles.buttonWrap}>
      <Button style={styles.button} href={confirmationUrl}>
        Sign In
      </Button>
    </div>
    <Text style={styles.small}>
      If you didn't request this link, you can safely ignore this email.
    </Text>
  </EmailLayout>
)

export default MagicLinkEmail
