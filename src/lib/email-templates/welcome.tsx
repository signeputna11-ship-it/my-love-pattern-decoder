import * as React from 'react'
import { Button, Heading, Text } from '@react-email/components'
import { EmailLayout, styles } from './_layout'
import type { TemplateEntry } from './registry'

interface WelcomeEmailProps {
  name?: string
}

const WelcomeEmail = ({ name }: WelcomeEmailProps) => (
  <EmailLayout preview="Welcome to My Love Pattern">
    <Heading style={styles.h1}>
      {name ? `Welcome, ${name}` : 'Welcome'}
    </Heading>
    <Text style={styles.text}>
      You're in. My Love Pattern is your private space to understand the loop your nervous system keeps following, and to build something different.
    </Text>
    <Text style={styles.text}>
      Your reset path is ready whenever you are. Take it slow. Come back as often as you need.
    </Text>
    <div style={styles.buttonWrap}>
      <Button style={styles.button} href="https://mylovepattern.com/app">
        Open My Reset
      </Button>
    </div>
    <Text style={styles.small}>
      Questions or feedback? Just reply to this email.
    </Text>
  </EmailLayout>
)

export const template = {
  component: WelcomeEmail,
  subject: 'Welcome to My Love Pattern',
  displayName: 'Welcome',
  previewData: { name: 'Sam' },
} satisfies TemplateEntry

export default WelcomeEmail
