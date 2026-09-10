import Link from "next/link";
import { EVENT_NAME } from "@/types/domain";

type HeroProps = {
  teamCount: number;
  playerCount: number;
  selectedCount: number;
  logoPath: string;
};

export function Hero({ teamCount, playerCount, selectedCount, logoPath }: HeroProps) {
  return (
    <>
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-copy">
            <h2>{EVENT_NAME}</h2>
            <p>Sign up as a player and keep the event roster ready for team selection.</p>
            <div className="scoreboard">
              <div className="score-item">
                <div className="num">{teamCount}</div>
                <div className="label">Teams registered</div>
              </div>
              <div className="score-item">
                <div className="num">{playerCount}</div>
                <div className="label">Players registered</div>
              </div>
              <div className="score-item">
                <div className="num">{selectedCount}</div>
                <div className="label">Players selected</div>
              </div>
            </div>
          </div>
          <img className="hero-logo" src={logoPath} alt={`${EVENT_NAME} logo`} />
        </div>
      </section>

      <Link className="cta-card" href="/register">
        <h3>Register as a player</h3>
        <p>Add your playing details so teams can review your profile.</p>
        <div className="go">Register player -&gt;</div>
      </Link>
    </>
  );
}
