import * as React from 'react'
import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from '@react-email/components'

const LOGO_URL = 'https://mylovepattern.com/mlp-logo.png'

interface EmailLayoutProps {
  preview: string
  children: React.ReactNode
}

export const EmailLayout = ({ preview, children }: EmailLayoutProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>{preview}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Img
            src={LOGO_URL}
            alt="My Love Pattern"
            width="62"
            height="62"
            style={logo}
          />
        </Section>
        <Section style={content}>{children}</Section>
        <Section style={signatureSection}>
          <Text style={signWith}>With love,</Text>
          <Text style={signName}>Signe Putna</Text>
          <Text style={signRole}>Founder, My Love Pattern</Text>
          <Text style={signLinks}>
            mylovepattern.com
            <br />
            <a href="mailto:hello@mylovepattern.com" style={signMail}>
              hello@mylovepattern.com
            </a>
          </Text>
          <Text style={signNote}>Private sessions available on request</Text>
        </Section>
        <Section style={footerSection}>
          <Text style={footerText}>
            My Love Pattern
          </Text>
          <Text style={footerSubtext}>
            mylovepattern.com
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export const styles = {
  h1: {
    fontSize: '24px',
    fontWeight: 'bold' as const,
    color: '#000000',
    margin: '0 0 20px',
    fontFamily: 'Georgia, "Times New Roman", serif',
    textAlign: 'center' as const,
  },
  text: {
    fontSize: '14px',
    color: '#55575d',
    lineHeight: '1.6',
    margin: '0 0 20px',
  },
  button: {
    backgroundColor: '#000000',
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: 'bold' as const,
    borderRadius: '8px',
    padding: '14px 28px',
    textDecoration: 'none',
    display: 'inline-block',
  },
  buttonWrap: {
    textAlign: 'center' as const,
    margin: '28px 0',
  },
  link: { color: '#000000', textDecoration: 'underline' },
  small: {
    fontSize: '12px',
    color: '#999999',
    margin: '24px 0 0',
    lineHeight: '1.5',
  },
  code: {
    display: 'inline-block',
    padding: '14px 22px',
    backgroundColor: '#f4f4f5',
    borderRadius: '8px',
    fontFamily: '"Courier New", monospace',
    fontSize: '20px',
    fontWeight: 'bold' as const,
    color: '#000000',
    letterSpacing: '4px',
  },
}

const main = {
  backgroundColor: '#ffffff',
  fontFamily: '"Helvetica Neue", Arial, sans-serif',
  margin: 0,
  padding: 0,
}
const container = {
  maxWidth: '560px',
  margin: '0 auto',
  padding: '32px 24px',
}
const header = { textAlign: 'center' as const, padding: '8px 0 24px' }
const logo = {
  margin: '0 auto',
  borderRadius: '50%',
  border: '1px solid #ececec',
}
const content = { padding: '0 4px' }
const footerSection = {
  textAlign: 'center' as const,
  borderTop: '1px solid #ececec',
  marginTop: '32px',
  paddingTop: '20px',
}
const footerText = {
  fontSize: '12px',
  color: '#666666',
  margin: '0 0 4px',
  fontFamily: 'Georgia, "Times New Roman", serif',
  fontStyle: 'italic' as const,
}
const footerSubtext = {
  fontSize: '11px',
  color: '#aaaaaa',
  margin: 0,
}
const signatureSection = {
  borderTop: '1px solid #ececec',
  marginTop: '32px',
  paddingTop: '24px',
}
const signWith = {
  fontSize: '14px',
  color: '#55575d',
  margin: '0 0 4px',
  fontFamily: 'Georgia, "Times New Roman", serif',
  fontStyle: 'italic' as const,
}
const signName = {
  fontSize: '16px',
  color: '#000000',
  margin: '0 0 2px',
  fontFamily: 'Georgia, "Times New Roman", serif',
}
const signRole = {
  fontSize: '13px',
  color: '#55575d',
  margin: '0 0 14px',
}
const signLinks = {
  fontSize: '13px',
  color: '#55575d',
  margin: '0 0 14px',
  lineHeight: '1.6',
}
const signMail = {
  color: '#000000',
  textDecoration: 'underline',
}
const signNote = {
  fontSize: '12px',
  color: '#999999',
  fontStyle: 'italic' as const,
  margin: 0,
}
