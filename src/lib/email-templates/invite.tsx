import * as React from 'react'
import { Button, Heading, Text } from '@react-email/components'
import { EmailLayout, styles } from './_layout'

interface InviteEmailProps {
  confirmationUrl: string
  email: string
}

export const InviteEmail = ({ confirmationUrl, email }: InviteEmailProps) => (
  <EmailLayout preview="You've been invited to My Love Pattern">
    <Heading style={styles.h1}>You've been invited</Heading>
    <Text style={styles.text}>
      You've been invited to join My Love Pattern as {email}. Accept the invite to get started.
    </Text>
    <div style={styles.buttonWrap}>
      <Button style={styles.button} href={confirmationUrl}>
        Accept Invite
      </Button>
    </div>
  </EmailLayout>
)

export default InviteEmail
