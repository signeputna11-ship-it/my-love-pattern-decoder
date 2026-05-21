import * as React from 'react'
import { Heading, Link, Text } from '@react-email/components'
import { EmailLayout, styles } from './_layout'
import type { TemplateEntry } from './registry'

interface PurchaseConfirmationProps {
  first_name?: string
  product_name?: string
  access_link?: string
}

const PurchaseConfirmationEmail = ({
  first_name,
  product_name,
  access_link,
}: PurchaseConfirmationProps) => {
  const name = first_name?.trim() || 'there'
  const product = product_name?.trim() || 'worksheet'
  const link = access_link?.trim() || 'https://mylovepattern.com/'
  return (
    <EmailLayout preview={`Your ${product} is here`}>
      <Heading style={styles.h1}>Your worksheet is here, {name} ✦</Heading>
      <Text style={styles.text}>Hi {name},</Text>
      <Text style={styles.text}>
        Your {product} is ready. Access it here:{' '}
        <Link href={link} style={{ color: '#a0574e' }}>{link}</Link>
      </Text>
      <Text style={styles.text}>This link never expires.</Text>
      <Text style={styles.text}>Signe, My Love Pattern</Text>
    </EmailLayout>
  )
}

export const template = {
  component: PurchaseConfirmationEmail,
  subject: (data: Record<string, any>) => {
    const name = (data?.first_name as string | undefined)?.trim() || 'there'
    return `Your worksheet is here, ${name} ✦`
  },
  displayName: 'Purchase confirmation',
  previewData: {
    first_name: 'Jane',
    product_name: 'Breadcrumbing & Red Flags worksheet',
    access_link: 'https://mylovepattern.com/w/example-token',
  },
} satisfies TemplateEntry

export default PurchaseConfirmationEmail
