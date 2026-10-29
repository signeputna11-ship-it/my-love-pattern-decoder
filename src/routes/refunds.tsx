import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/front/LegalPage";
import { BUSINESS } from "@/lib/legal";

export const Route = createFileRoute("/refunds")({
  component: Refunds,
  head: () => ({
    meta: [{ title: "Refund policy · Signe Coach" }, { name: "description", content: "How refunds and cancellations work." }],
  }),
});

function Refunds() {
  return (
    <LegalPage title="Refund policy">
      <p>
        {BUSINESS.name} sells digital content and services that become available the moment you pay. Because of that, payments are
        non-refundable once access begins.
      </p>

      <h2>How it works</h2>
      <ul>
        <li>At checkout you ask for immediate access and confirm that you understand this policy.</li>
        <li>
          Once you start using the digital content or service, you lose the 14-day right of withdrawal that normally applies to
          online purchases in the EU.
        </li>
        <li>Memberships, workbooks, audio libraries and recorded intensives are all covered.</li>
      </ul>

      <h2>Cancelling a membership</h2>
      <ul>
        <li>Cancel any time from the Membership page. You will not be charged again after your current period.</li>
        <li>Access stays open until the end of the period you have paid for.</li>
        <li>We do not refund the unused part of a period that has already started.</li>
      </ul>

      <h2>1:1 sessions and live offers</h2>
      <p>The booking, rescheduling and cancellation terms are shown when you book. Please read them before you pay.</p>

      <h2>When we will help</h2>
      <ul>
        <li>You were charged twice or by mistake.</li>
        <li>A technical problem on our side stopped you from getting what you paid for and we could not fix it.</li>
        <li>The law in your country gives you a right to a refund that cannot be waived. That right stays in place.</li>
      </ul>
      <p>
        Write to {BUSINESS.email} with your account email and what happened. We reply within a few working days.
      </p>
    </LegalPage>
  );
}
