import { RegisterPlayerForm } from "@/components/RegisterPlayerForm";

export default function RegisterPage() {
  return (
    <section className="panel">
      <h2>Register as a player</h2>
      <p className="desc">Share your category and contact details for team selection.</p>
      <RegisterPlayerForm />
    </section>
  );
}
