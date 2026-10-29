import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/front/LegalPage";
import { BUSINESS } from "@/lib/legal";

export const Route = createFileRoute("/terms")({
  component: Terms,
  head: () => ({
    meta: [{ title: "Terms of use · Signe Coach" }, { name: "description", content: "The terms for using the Signe Coach app." }],
  }),
});

function Terms() {
  return (
    <LegalPage title="Terms of use">
      <p>
        These terms apply when you create an account or use the {BUSINESS.name} app and website. {BUSINESS.name} is run by{" "}
        {BUSINESS.operator}, {BUSINESS.location}. By creating an account you agree to them.
      </p>

      <h2>What Signe Coach is</h2>
      <p>
        {BUSINESS.name} offers educational self-reflection, coaching tools, interactive workbooks and guided audio for personal growth.
        It is not medical, psychological or psychiatric care and does not replace it. If you are in crisis or need medical advice,
        please contact your doctor, a licensed professional or your local emergency number.
      </p>

      <h2>Who can use it</h2>
      <ul>
        <li>You are 18 or over.</li>
        <li>You give accurate details and keep your login private.</li>
        <li>One account is for one person. Please do not share your access.</li>
      </ul>

      <h2>Free and paid access</h2>
      <ul>
        <li>The free tier includes the quiz, selected audio, intro lessons and daily support cards.</li>
        <li>The membership is billed monthly or yearly through Stripe and renews automatically until you cancel.</li>
        <li>You can cancel any time from the Membership page. Access continues until the end of the period you have paid for.</li>
        <li>Individual offers, intensives and 1:1 sessions are priced and described when you buy them.</li>
        <li>Prices include any taxes shown at checkout. We may change prices for future renewals and will tell you in advance.</li>
      </ul>

      <h2>Refunds</h2>
      <p>
        Digital content and memberships are non-refundable once access begins. The full details, including your legal rights as a
        consumer, are in the Refund Policy, which forms part of these terms.
      </p>

      <h2>Audio safety</h2>
      <ul>
        <li>Listen in a safe, comfortable place. Never listen while driving or using machinery.</li>
        <li>Use headphones for binaural audio.</li>
        <li>
          If you have epilepsy, a seizure condition, a heart condition or are pregnant, please speak with your doctor before using
          binaural or relaxation audio.
        </li>
        <li>Stop if you feel unwell.</li>
      </ul>

      <h2>Your content</h2>
      <p>
        Your workbook answers and notes belong to you and are private to your account. You give us permission to store them so the
        app can work for you.
      </p>

      <h2>Our content</h2>
      <p>
        The audio, workbooks, text, images and branding are owned by {BUSINESS.operator} or used with permission. You may use them for
        your own personal growth. Please do not copy, resell, share publicly or train software on them.
      </p>

      <h2>Results</h2>
      <p>
        Growth is personal and results vary. We do not promise a specific outcome, income or change. You are responsible for the
        decisions you make.
      </p>

      <h2>Changes and ending an account</h2>
      <p>
        We may update these terms and the app. When a change matters, we ask you to accept the new version. You can close your
        account by emailing us. We may suspend access if these terms are broken.
      </p>

      <h2>Law and contact</h2>
      <p>
        These terms follow the laws of Portugal. Mandatory consumer rights in your country of residence still apply. Questions:{" "}
        {BUSINESS.email}.
      </p>
    </LegalPage>
  );
}
