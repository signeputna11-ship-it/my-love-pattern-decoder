import * as React from 'react'
import { render } from '@react-email/components'
import { createClient } from '@supabase/supabase-js'
import { TEMPLATES } from '@/lib/email-templates/registry'

const SITE_NAME = 'My Love Pattern'
const SENDER_DOMAIN = 'notify.mylovepattern.com'
const FROM_DOMAIN = 'mylovepattern.com'

function generateToken(): string {
  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes)
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

interface EnqueueParams {
  templateName: string
  recipientEmail: string
  idempotencyKey?: string
  templateData?: Record<string, any>
}

/**
 * Server-side helper to enqueue a transactional email using the service-role
 * Supabase client. Use this from server routes that don't have an
 * authenticated user context (e.g., Stripe webhook).
 *
 * Returns { success, reason? } so callers can log without throwing.
 */
export async function enqueueTransactionalEmailAsService(
  params: EnqueueParams,
): Promise<{ success: boolean; reason?: string }> {
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('[enqueueTransactionalEmailAsService] missing env')
    return { success: false, reason: 'config' }
  }

  const template = TEMPLATES[params.templateName]
  if (!template) {
    console.error('[enqueueTransactionalEmailAsService] unknown template', params.templateName)
    return { success: false, reason: 'unknown_template' }
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  const recipient = template.to ?? params.recipientEmail
  const normalized = recipient.toLowerCase()
  const messageId = crypto.randomUUID()
  const idempotencyKey = params.idempotencyKey ?? messageId
  const data = params.templateData ?? {}

  // Suppression check
  const { data: suppressed } = await supabase
    .from('suppressed_emails')
    .select('id')
    .eq('email', normalized)
    .maybeSingle()
  if (suppressed) {
    await supabase.from('email_send_log').insert({
      message_id: messageId,
      template_name: params.templateName,
      recipient_email: recipient,
      status: 'suppressed',
    })
    return { success: false, reason: 'suppressed' }
  }

  // Get/create unsubscribe token
  let unsubscribeToken: string
  const { data: existing } = await supabase
    .from('email_unsubscribe_tokens')
    .select('token, used_at')
    .eq('email', normalized)
    .maybeSingle()
  if (existing && !existing.used_at) {
    unsubscribeToken = existing.token
  } else if (!existing) {
    unsubscribeToken = generateToken()
    await supabase
      .from('email_unsubscribe_tokens')
      .upsert(
        { token: unsubscribeToken, email: normalized },
        { onConflict: 'email', ignoreDuplicates: true },
      )
    const { data: stored } = await supabase
      .from('email_unsubscribe_tokens')
      .select('token')
      .eq('email', normalized)
      .maybeSingle()
    unsubscribeToken = stored?.token ?? unsubscribeToken
  } else {
    return { success: false, reason: 'token_used' }
  }

  // Render
  const element = React.createElement(template.component, data)
  const html = await render(element)
  const text = await render(element, { plainText: true })
  const subject =
    typeof template.subject === 'function' ? template.subject(data) : template.subject

  // Log pending
  await supabase.from('email_send_log').insert({
    message_id: messageId,
    template_name: params.templateName,
    recipient_email: recipient,
    status: 'pending',
  })

  const { error } = await supabase.rpc('enqueue_email', {
    queue_name: 'transactional_emails',
    payload: {
      message_id: messageId,
      to: recipient,
      from: `${SITE_NAME} <noreply@${FROM_DOMAIN}>`,
      sender_domain: SENDER_DOMAIN,
      subject,
      html,
      text,
      purpose: 'transactional',
      label: params.templateName,
      idempotency_key: idempotencyKey,
      unsubscribe_token: unsubscribeToken,
      queued_at: new Date().toISOString(),
    },
  })

  if (error) {
    await supabase.from('email_send_log').insert({
      message_id: messageId,
      template_name: params.templateName,
      recipient_email: recipient,
      status: 'failed',
      error_message: 'Failed to enqueue email',
    })
    return { success: false, reason: 'enqueue_failed' }
  }

  return { success: true }
}
