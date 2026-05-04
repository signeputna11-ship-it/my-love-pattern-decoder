import { supabase } from '@/integrations/supabase/client'

interface SendTransactionalEmailParams {
  templateName: string
  recipientEmail: string
  idempotencyKey?: string
  templateData?: Record<string, any>
}

/**
 * Client-side helper to trigger a transactional email send.
 * Requires the caller to be authenticated.
 */
export async function sendTransactionalEmail(
  params: SendTransactionalEmailParams,
): Promise<{ success: boolean; reason?: string }> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    return { success: false, reason: 'not_authenticated' }
  }
  try {
    const res = await fetch('/lovable/email/transactional/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        templateName: params.templateName,
        recipientEmail: params.recipientEmail,
        idempotencyKey: params.idempotencyKey,
        templateData: params.templateData,
      }),
    })
    if (!res.ok) {
      console.error('[sendTransactionalEmail] failed', res.status)
      return { success: false, reason: `http_${res.status}` }
    }
    return await res.json()
  } catch (err) {
    console.error('[sendTransactionalEmail] error', err)
    return { success: false, reason: 'network_error' }
  }
}
