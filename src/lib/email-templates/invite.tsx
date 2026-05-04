import * as React from 'react'
import { Button, Heading, Link, Text } from '@react-email/components'
import { EmailLayout, styles } from './_layout'

interface InviteEmailProps {
  siteName: string
  siteUrl: string
  confirmationUrl: string
}

export const InviteEmail = ({ siteUrl, confirmationUrl }: InviteEmailProps) => (
  <EmailLayout preview="You've been invited to My Love Pattern">
    <Heading style={styles.h1}>You've been invited</Heading>
    <Text style={styles.text}>
      You've been invited to join{' '}
      <Link href={siteUrl} style={styles.link}>
        <strong>My Love Pattern</strong>
      </Link>
      . Accept the invitation below to create your account and begin your reset.
    </Text>
    <div style={styles.buttonWrap}>
      <Button style={styles.button} href={confirmationUrl}>
        Accept Invitation
      </Button>
    </div>
    <Text style={styles.small}>
      If you weren't expecting this invitation, you can safely ignore this email.
    </Text>
  </EmailLayout>
)

export default InviteEmail
