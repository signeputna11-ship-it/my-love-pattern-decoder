import * as React from 'react'
import { Heading, Link, Text } from '@react-email/components'
import { EmailLayout, styles } from './_layout'
import type { TemplateEntry } from './registry'

interface PurchaseConfirmationProps {
  first_name?: string
  product_name?: string
  access_link?: string
  product_slug?: string
}

const CALENDLY_URL = 'https://calendly.com/mylovepattern/30min'

type Kind = 'kit' | 'session' | 'worksheet'

function kindFromSlug(slug?: string): Kind {
  if (slug === 'love-pattern-reset-kit') return 'kit'
  if (slug === 'deep-pattern-reset') return 'session'
  return 'worksheet'
}

function headingFor(kind: Kind, name: string): string {
  if (kind === 'kit') return `Your Reset Kit is unlocked, ${name} ✦`
  if (kind === 'session') return `Your Deep Pattern Reset is booked, ${name} ✦`
  return `Your worksheet is here, ${name} ✦`
}

function subjectFor(kind: Kind): string {
  if (kind === 'kit') return 'Your Reset Kit is unlocked ✦'
  if (kind === 'session') return 'Your Deep Pattern Reset — next steps inside ✦'
  return 'Your worksheet is here ✦'
}

const PurchaseConfirmationEmail = ({
  first_name,
  product_name,
  access_link,
  product_slug,
}: PurchaseConfirmationProps) => {
  const name = first_name?.trim() || 'there'
  const product = product_name?.trim() || 'order'
  const link = access_link?.trim() || 'https://mylovepattern.com/'
  const kind = kindFromSlug(product_slug)
  return (
    <EmailLayout preview={`Your ${product} is ready`}>
      <Heading style={styles.h1}>{headingFor(kind, name)}</Heading>
      <Text style={styles.text}>Hi {name},</Text>
      {kind === 'session' ? (
        <>
          <Text style={styles.text}>
            Thank you for booking The Deep Pattern Reset. Next step: pick a time that works for you using the link below.
          </Text>
          <Text style={styles.text}>
            <Link href={CALENDLY_URL} style={{ color: '#a0574e' }}>Book your 90-minute session →</Link>
          </Text>
          <Text style={styles.text}>
            Within 24 hours Signe will email you the pre-session pattern clarity worksheet. If anything comes up before then, just reply to this email.
          </Text>
        </>
      ) : (
        <>
          <Text style={styles.text}>
            Your {product} is ready. Access it here:{' '}
            <Link href={link} style={{ color: '#a0574e' }}>{link}</Link>
          </Text>
          <Text style={styles.text}>This link never expires.</Text>
        </>
      )}
      <Text style={styles.text}>Signe, My Love Pattern</Text>
    </EmailLayout>
  )
}

export const template = {
  component: PurchaseConfirmationEmail,
  subject: (data: Record<string, any>) => subjectFor(kindFromSlug(data?.product_slug as string | undefined)),
  displayName: 'Purchase confirmation',
  previewData: {
    first_name: 'Jane',
    product_name: 'Breadcrumbing & Red Flags worksheet',
    access_link: 'https://mylovepattern.com/w/example-token',
    product_slug: 'breadcrumbing-red-flags',
  },
} satisfies TemplateEntry

export default PurchaseConfirmationEmail
