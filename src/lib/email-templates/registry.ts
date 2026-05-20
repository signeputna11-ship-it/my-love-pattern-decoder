import type { ComponentType } from 'react'

export interface TemplateEntry {
  component: ComponentType<any>
  subject: string | ((data: Record<string, any>) => string)
  displayName?: string
  previewData?: Record<string, any>
  /** Fixed recipient — overrides caller-provided recipientEmail when set. */
  to?: string
}

import { template as welcomeTemplate } from './welcome'
import { template as purchaseConfirmationTemplate } from './purchase-confirmation'
import { template as courseNotificationTemplate } from './course-notification'
import { template as passwordResetFollowupTemplate } from './password-reset-followup'
import { template as nurtureSequenceTemplate } from './nurture-sequence'

/**
 * Template registry — maps template names to their React Email components.
 * Import and register new templates here after creating them in this directory.
 */
export const TEMPLATES: Record<string, TemplateEntry> = {
  'welcome': welcomeTemplate,
  'purchase-confirmation': purchaseConfirmationTemplate,
  'course-notification': courseNotificationTemplate,
  'password-reset-followup': passwordResetFollowupTemplate,
  'nurture-sequence': nurtureSequenceTemplate,
}
