import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/front/LegalPage";
import { BUSINESS } from "@/lib/legal";

export const Route = createFileRoute("/privacy")({
  component: Privacy,
  head: () => ({
    meta: [{ title: "Privacy policy · Signe Coach" }, { name: "description", content: "How Signe Coach looks after your data." }],
  }),
});

function Privacy() {
  return (
    <LegalPage title="Privacy policy">
      <p>
        {BUSINESS.operator}, {BUSINESS.location}, runs {BUSINESS.name} and is responsible for your personal data. Contact:{" "}
        {BUSINESS.email}.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li>Account details: your email, name and, if you use Google, your Google profile name and email.</li>
        <li>Quiz answers and the starting point they suggest.</li>
        <li>Your workbook answers, notes, progress and the audio you play.</li>
        <li>Payment details are handled by Stripe. We receive the status of your purchase, never your card number.</li>
        <li>Your acceptance of our terms, with the date and version.</li>
      </ul>

      <h2>Why we use it</h2>
      <ul>
        <li>To run your account and give you the content you chose. Legal basis: contract.</li>
        <li>To send service emails such as sign-in and receipts. Legal basis: contract and legitimate interest.</li>
        <li>To send news, offers and encouragement. Legal basis: your consent, given separately. You can withdraw it in any email.</li>
        <li>To keep the app secure and to meet tax and legal duties.</li>
      </ul>

      <h2>Sensitive reflections</h2>
      <p>
        Workbook answers can be personal. They are visible only to you and protected by row-level security in our database. We do not
        sell your data and do not use your answers for advertising.
      </p>

      <h2>Who helps us</h2>
      <p>
        We use trusted providers to run the app: Supabase (database and sign-in), Stripe (payments), Cloudflare (hosting), Google
        (optional sign-in) and an email provider for messages. They process data for us under their own data protection terms. Some
        may process data outside the EU under standard safeguards.
      </p>

      <h2>How long we keep it</h2>
      <p>
        We keep your data while your account is open. When you ask us to delete it, we remove it within 30 days, except records we must
        keep for tax and legal reasons.
      </p>

      <h2>Your rights</h2>
      <p>
        You can ask to see, correct, export or delete your data, to object to some uses and to withdraw consent at any time. Write to{" "}
        {BUSINESS.email}. You can also complain to the Portuguese data protection authority, the CNPD (cnpd.pt).
      </p>

      <h2>Cookies</h2>
      <p>
        The app uses the storage it needs to keep you signed in and remember your settings. We do not use advertising cookies.
      </p>
    </LegalPage>
  );
}
