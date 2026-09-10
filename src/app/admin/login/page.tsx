import { loginAction } from "@/app/admin/actions";

export default async function AdminLoginPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <section className="panel">
      <h2>Admin login</h2>
      <p className="desc">Sign in to manage SPORTATHON 3.0 registrations and teams.</p>
      {params.error ? <div className="msg err">Invalid email or password.</div> : null}
      <form action={loginAction}>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" required type="email" />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input id="password" name="password" required minLength={8} type="password" />
        </div>
        <button className="btn" type="submit">
          Sign in
        </button>
      </form>
    </section>
  );
}
