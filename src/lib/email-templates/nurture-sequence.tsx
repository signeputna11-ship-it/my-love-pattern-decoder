import * as React from 'react'
import { Button, Heading, Text } from '@react-email/components'
import { EmailLayout, styles } from './_layout'
import type { TemplateEntry } from './registry'

interface NurtureProps {
  step: number
  first_name?: string
  shop_url?: string
  contact_email?: string
}

const SHOP_URL = 'https://mylovepattern.com/shop'

function renderStep(step: number, first_name: string) {
  switch (step) {
    case 2:
      return (
        <>
          <Heading style={styles.h1}>The belief underneath your pattern, {first_name}</Heading>
          <Text style={styles.text}>Hi {first_name},</Text>
          <Text style={styles.text}>
            Yesterday you unlocked a tool for working with your pattern at the level of behaviour. Today I want to go one level deeper.
          </Text>
          <Text style={styles.text}>
            Every pattern has a belief underneath it. Not a conscious one. Something that formed early, in the first relationship you ever had, before you had words for any of it.
          </Text>
          <Text style={styles.text}>
            The Over-Investor believes love is something you earn through effort.<br />
            The Unavailable Chaser believes if it comes easily it is not really love.<br />
            The Validator Seeker believes they are only as lovable as someone's last response to them.<br />
            The Boundary Softener believes if they ask for too much they will be left.
          </Text>
          <Text style={styles.text}>
            These beliefs were not mistakes. They were adaptations. The problem is they followed you into adult relationships where the old rules no longer apply.
          </Text>
          <Text style={styles.text}>
            If you have not yet taken the free quiz: <a href="https://mylovepattern.com" style={styles.link}>mylovepattern.com</a>
          </Text>
          <Text style={styles.text}>
            Tomorrow I want to tell you about why knowing your pattern is not enough, and what actually changes things.
          </Text>
        </>
      )
    case 3:
      return (
        <>
          <Heading style={styles.h1}>Why knowing your pattern is not enough</Heading>
          <Text style={styles.text}>Hi {first_name},</Text>
          <Text style={styles.text}>
            You can know exactly what your pattern is. You can trace it to your childhood. You can describe the mechanism clearly. And still end up in the same relationship.
          </Text>
          <Text style={styles.text}>
            Patterns do not live in the mind. They live in the nervous system, in the part of you that formed its beliefs about love before you had language for any of it. Talking about them is useful. But talking is not the same as changing them at the level where they actually operate.
          </Text>
          <Text style={styles.text}>
            What changes things is working directly on the belief underneath the behaviour. That is what the full Reset Kit is designed to do. Twenty tools across five stages.
          </Text>
          <div style={styles.buttonWrap}>
            <Button style={styles.button} href={SHOP_URL}>Get the Full Kit, $49</Button>
          </div>
        </>
      )
    case 4:
      return (
        <>
          <Heading style={styles.h1}>What she said after her pattern shifted</Heading>
          <Text style={styles.text}>Hi {first_name},</Text>
          <Text style={styles.text}>
            She told me: the most painful relationship of my life was with someone who never actually chose me.
          </Text>
          <Text style={styles.text}>
            When she understood she was an Unavailable Chaser, that she was wired to find unavailability magnetic, something shifted. Not immediately. Not dramatically. But the next time she felt that pull toward someone unclear, she recognised it. And she made a different choice.
          </Text>
          <Text style={styles.text}>
            Not because she decided to. Because she finally understood what the pull was made of.
          </Text>
          <Text style={styles.text}>
            That is what pattern work actually does. It does not make you love less. It gives you the information to love better.
          </Text>
          <div style={styles.buttonWrap}>
            <Button style={styles.button} href={SHOP_URL}>Get the Full Kit, $49</Button>
          </div>
        </>
      )
    case 5:
      return (
        <>
          <Heading style={styles.h1}>What happens when the belief actually updates</Heading>
          <Text style={styles.text}>Hi {first_name},</Text>
          <Text style={styles.text}>
            I want to tell you about something that happens in my private sessions.
          </Text>
          <Text style={styles.text}>
            We go to the origin of the belief. Not to relive it. To understand it with the mind of an adult instead of the mind of a child who had no other reference point.
          </Text>
          <Text style={styles.text}>
            When you can see where the belief came from and why it formed, something changes in how much authority it has over you. It stops feeling like the truth about love. It starts feeling like a conclusion a young version of you drew with the information she had at the time.
          </Text>
          <Text style={styles.text}>
            That is when the behaviour changes. Not because you decided to change it. Because the belief driving it no longer feels true in the same way.
          </Text>
          <div style={{ background: '#faf7f2', border: '1px solid #e8dccb', borderRadius: 16, padding: 28, margin: '28px 0', textAlign: 'center' as const }}>
            <Heading as="h3" style={{ ...styles.h1, fontSize: 22, margin: 0 }}>The Deep Pattern Reset</Heading>
            <Text style={{ ...styles.text, marginTop: 10 }}>
              90 minutes. A deeply relaxed meditative state. Direct work on the belief at the level where it lives. A personalised 21-day audio to anchor the shift.
            </Text>
            <Text style={{ ...styles.text, fontWeight: 600, marginTop: 6 }}>$333 per session</Text>
            <div style={{ marginTop: 18 }}>
              <a href="mailto:mylovepattern@gmail.com?subject=Deep%20Pattern%20Reset%20-%20Discovery%20Call" style={{ display: 'inline-block', background: '#111111', color: 'white', borderRadius: 100, padding: '10px 24px', textDecoration: 'none', fontSize: 14 }}>
                Email Signe to arrange a discovery call →
              </a>
            </div>
            <Text style={{ ...styles.small, marginTop: 14 }}>Signe responds personally. Limited spots each month.</Text>
          </div>
          <Text style={styles.text}>Signe</Text>
        </>
      )
    case 6:
      return (
        <>
          <Heading style={styles.h1}>{first_name}, the kit is still here</Heading>
          <Text style={styles.text}>Hi {first_name},</Text>
          <Text style={styles.text}>Quick note.</Text>
          <Text style={styles.text}>
            You downloaded one worksheet from My Love Pattern about two weeks ago. I hope it gave you something useful to work with.
          </Text>
          <Text style={styles.text}>
            If you are ready for the full reset, nineteen more tools are waiting.
          </Text>
          <div style={styles.buttonWrap}>
            <Button style={styles.button} href={SHOP_URL}>Get the Full Kit, $49</Button>
          </div>
          <Text style={styles.text}>
            And if you are done hearing from me about this, just reply with the word unsubscribe.
          </Text>
        </>
      )
    case 7:
      return (
        <>
          <Heading style={styles.h1}>Last one from me for now, {first_name}</Heading>
          <Text style={styles.text}>Hi {first_name},</Text>
          <Text style={styles.text}>This is the last email in this sequence.</Text>
          <Text style={styles.text}>
            I will keep sending the weekly letter if you want to stay. It goes out every Tuesday with honest writing on love patterns, self-worth, and what actually changes things.
          </Text>
          <Text style={styles.text}>
            If you want the full Reset Kit before I stop nudging you about it: <a href={SHOP_URL} style={styles.link}>mylovepattern.com/shop, $49</a>
          </Text>
          <Text style={styles.text}>
            If you are ready for a private session: email <a href="mailto:mylovepattern@gmail.com?subject=Deep%20Pattern%20Reset" style={styles.link}>mylovepattern@gmail.com</a> with the subject Deep Pattern Reset.
          </Text>
          <Text style={styles.text}>
            Either way I am glad you found My Love Pattern. The fact that you are here means something is already shifting.
          </Text>
        </>
      )
    default:
      return <Text style={styles.text}>Hi {first_name},</Text>
  }
}

const SUBJECTS: Record<number, (n: string) => string> = {
  2: (n) => `The belief underneath your pattern, ${n}`,
  3: () => `Why knowing your pattern is not enough`,
  4: () => `What she said after her pattern shifted`,
  5: () => `What happens when the belief actually updates`,
  6: (n) => `${n}, the kit is still here`,
  7: (n) => `Last one from me for now, ${n}`,
}

const NurtureSequenceEmail = ({ step = 2, first_name }: NurtureProps) => {
  const name = (first_name && first_name.trim()) || 'friend'
  const subject =
    SUBJECTS[step]?.(name) ?? `My Love Pattern, note ${step}`
  return (
    <EmailLayout preview={subject}>
      {renderStep(step, name)}
    </EmailLayout>
  )
}

export const template = {
  component: NurtureSequenceEmail,
  subject: (data: Record<string, any>) => {
    const name = (data?.first_name && String(data.first_name).trim()) || 'friend'
    const step = Number(data?.step ?? 2)
    return SUBJECTS[step]?.(name) ?? `My Love Pattern, note ${step}`
  },
  displayName: 'Nurture sequence',
  previewData: { step: 2, first_name: 'Friend' },
} satisfies TemplateEntry

export default NurtureSequenceEmail
