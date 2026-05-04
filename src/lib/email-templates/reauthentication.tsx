import * as React from 'react'
import { Heading, Text } from '@react-email/components'
import { EmailLayout, styles } from './_layout'

interface ReauthenticationEmailProps {
  token: string
  email: string
}

export const ReauthenticationEmail = ({ token }: ReauthenticationEmailProps) => (
  <EmailLayout preview="Your verification code">
    <Heading style={styles.h1}>Your verification code</Heading>
    <Text style={styles.text}>
      Use the code below to confirm this action on your account.
    </Text>
    <div style={styles.buttonWrap}>
      <span style={styles.code}>{token}</span>
    </div>
    <Text style={styles.small}>
      This code expires shortly. If you didn't request it, please secure your account.
    </Text>
  </EmailLayout>
)

export default ReauthenticationEmail
