import * as React from 'react'
import { Button, Heading, Text } from '@react-email/components'
import { EmailLayout, styles } from './_layout'
import type { TemplateEntry } from './registry'

interface PurchaseConfirmationProps {
  amount?: string
  currency?: string
}

const PurchaseConfirmationEmail = ({
  amount,
  currency,
}: PurchaseConfirmationProps) => (
  <EmailLayout preview="Your access is unlocked">
    <Heading style={styles.h1}>Your access is unlocked</Heading>
    <Text style={styles.text}>
      Thank you for your purchase. Your full reset path is now available.
    </Text>
    {amount ? (
      <Text style={styles.text}>
        Amount charged: <strong>{amount} {currency?.toUpperCase() ?? ''}</strong>
      </Text>
    ) : null}
    <div style={styles.buttonWrap}>
      <Button style={styles.button} href="https://mylovepattern.com/app">
        Start Your Reset
      </Button>
    </div>
    <Text style={styles.small}>
      Keep this email as your receipt. If you have any questions, just reply.
    </Text>
  </EmailLayout>
)

export const template = {
  component: PurchaseConfirmationEmail,
  subject: 'Your access is unlocked',
  displayName: 'Purchase confirmation',
  previewData: { amount: '49.00', currency: 'usd' },
} satisfies TemplateEntry

export default PurchaseConfirmationEmail
