"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import { confirmAuctionSale, markAuctionUnsold } from "@/app/auction/actions";
import { EVENT_NAME, type PlayerView } from "@/types/domain";

const BID_STEP = 50;

function formatPoints(points: number) {
  return `${points} Points`;
}

function initialBid(player: PlayerView) {
  return player.soldPrice ?? player.basePrice ?? BID_STEP;
}

function styleValue(value?: string) {
  return value || "-";
}

type AuctionStageProps = Readonly<{
  logoPath: string;
  players: PlayerView[];
}>;

type AuctionNotice = Readonly<{
  id: number;
  kind: "bid" | "sold" | "unsold" | "error";
  title: string;
  message: string;
}>;

export function AuctionStage({ logoPath, players }: AuctionStageProps) {
  const router = useRouter();
  const [playerOverrides, setPlayerOverrides] = useState<Record<string, Partial<PlayerView>>>({});
  const [activeIndex, setActiveIndex] = useState(0);
  const [bidByPlayer, setBidByPlayer] = useState<Record<string, number>>(() =>
    Object.fromEntries(players.map((player) => [player.id, initialBid(player)]))
  );
  const [notice, setNotice] = useState<AuctionNotice | null>(null);
  const [isPending, startTransition] = useTransition();

  const auctionPlayers = useMemo(
    () => players.map((player) => ({ ...player, ...playerOverrides[player.id] })),
    [playerOverrides, players]
  );
  const safeActiveIndex = Math.min(activeIndex, Math.max(0, auctionPlayers.length - 1));
  const activePlayer = auctionPlayers[safeActiveIndex];
  const isSold = activePlayer?.status === "sold";
  const currentBid = activePlayer
    ? isSold && typeof activePlayer.soldPrice === "number"
      ? activePlayer.soldPrice
      : bidByPlayer[activePlayer.id] ?? initialBid(activePlayer)
    : BID_STEP;

  const soldCount = useMemo(() => auctionPlayers.filter((player) => player.status === "sold").length, [auctionPlayers]);

  useEffect(() => {
    const refresh = () => router.refresh();
    const interval = window.setInterval(refresh, 2500);
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") refresh();
    };

    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [router]);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), 2600);
    return () => window.clearTimeout(timer);
  }, [notice]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowLeft") setActiveIndex((index) => Math.max(0, index - 1));
      if (event.key === "ArrowRight") setActiveIndex((index) => Math.min(auctionPlayers.length - 1, index + 1));
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [auctionPlayers.length]);

  function move(delta: number) {
    setActiveIndex((index) => Math.min(auctionPlayers.length - 1, Math.max(0, index + delta)));
  }

  function raiseBid() {
    if (!activePlayer || isSold) return;
    const nextBid = currentBid + BID_STEP;

    setBidByPlayer((current) => ({
      ...current,
      [activePlayer.id]: nextBid
    }));
    setNotice({
      id: Date.now(),
      kind: "bid",
      message: `${activePlayer.name} current bid is now ${formatPoints(nextBid)}.`,
      title: `${formatPoints(nextBid)} bid`
    });
  }

  function confirmSold() {
    if (!activePlayer || isSold) return;
    const playerId = activePlayer.id;
    const playerName = activePlayer.name;
    const soldPrice = currentBid;

    startTransition(async () => {
      try {
        await confirmAuctionSale(playerId, soldPrice);
        setPlayerOverrides((current) => ({ ...current, [playerId]: { status: "sold" as const, soldPrice } }));
        setNotice({
          id: Date.now(),
          kind: "sold",
          message: `${playerName} sold for ${formatPoints(soldPrice)}.`,
          title: "Sold confirmed"
        });
        router.refresh();
      } catch {
        setNotice({
          id: Date.now(),
          kind: "error",
          message: "The sale was not saved. Please try again.",
          title: "Update failed"
        });
      }
    });
  }

  function resetUnsold() {
    if (!activePlayer || !isSold) return;
    const playerId = activePlayer.id;
    const playerName = activePlayer.name;

    startTransition(async () => {
      try {
        await markAuctionUnsold(playerId);
        setPlayerOverrides((current) => ({
          ...current,
          [playerId]: { soldPrice: undefined, soldTo: undefined, status: "unsold" as const }
        }));
        setBidByPlayer((current) => ({
          ...current,
          [playerId]: activePlayer.basePrice ?? BID_STEP
        }));
        setNotice({
          id: Date.now(),
          kind: "unsold",
          message: `${playerName} is back to unsold at ${formatPoints(activePlayer.basePrice ?? BID_STEP)}.`,
          title: "Marked unsold"
        });
        router.refresh();
      } catch {
        setNotice({
          id: Date.now(),
          kind: "error",
          message: "The player was not updated. Please try again.",
          title: "Update failed"
        });
      }
    });
  }

  if (!activePlayer) {
    return (
      <main className="auction-stage-page empty-stage">
        <img src={logoPath} alt={`${EVENT_NAME} logo`} />
        <h1>No players found</h1>
      </main>
    );
  }

  return (
    <main className="auction-stage-page">
      <header className="auction-stage-bar">
        <div className="auction-stage-brand">
          <img src={logoPath} alt={`${EVENT_NAME} logo`} />
          <span>{EVENT_NAME}</span>
        </div>
        <div className="auction-stage-count">
          <strong>{safeActiveIndex + 1}</strong> / {auctionPlayers.length}
        </div>
      </header>

      <section className={`auction-stage-card ${isSold ? "sold" : ""}`}>
        <div className="auction-stage-photo">
          {activePlayer.photoDataUrl ? <img src={activePlayer.photoDataUrl} alt="" /> : <span>{activePlayer.name.charAt(0)}</span>}
        </div>

        <div className="auction-stage-screen">
          <div className="auction-stage-topline">
            <span>{activePlayer.category}</span>
            <strong className={isSold ? "sold" : ""}>{isSold ? "Sold" : "Unsold"}</strong>
          </div>
          <h1>{activePlayer.name}</h1>
          <div className="auction-stage-facts">
            <span>Age {activePlayer.age || "-"}</span>
            <span>{styleValue(activePlayer.batsmanStyle)}</span>
            <span>{styleValue(activePlayer.bowlerStyle)}</span>
          </div>

          <div className="auction-stage-price">
            <span>{isSold ? "Sold Price" : "Current Bid"}</span>
            <strong>{formatPoints(currentBid)}</strong>
          </div>

          {isSold ? <div className="auction-sold-stamp">Sold</div> : null}
        </div>
      </section>

      <footer className="auction-stage-controls">
        <div className="auction-stage-nav">
          <button type="button" onClick={() => move(-1)} disabled={safeActiveIndex === 0}>
            Previous
          </button>
          <select
            value={activePlayer.id}
            onChange={(event) => {
              const nextIndex = auctionPlayers.findIndex((player) => player.id === event.target.value);
              if (nextIndex >= 0) setActiveIndex(nextIndex);
            }}
          >
            {auctionPlayers.map((player, index) => (
              <option key={player.id} value={player.id}>
                {index + 1}. {player.name}
              </option>
            ))}
          </select>
          <button type="button" onClick={() => move(1)} disabled={safeActiveIndex === auctionPlayers.length - 1}>
            Next
          </button>
        </div>

        <div className="auction-stage-actions">
          <span>{soldCount} sold</span>
          <button className="bid" type="button" onClick={raiseBid} disabled={isSold || isPending}>
            Bid +{BID_STEP}
          </button>
          <button className="confirm" type="button" onClick={confirmSold} disabled={isSold || isPending}>
            Confirm Sold
          </button>
          <button className="unsold" type="button" onClick={resetUnsold} disabled={!isSold || isPending}>
            Mark Unsold
          </button>
        </div>
      </footer>

      {notice ? (
        <div className={`auction-toast ${notice.kind}`} role="status" aria-live="polite">
          <strong>{notice.title}</strong>
          <span>{notice.message}</span>
        </div>
      ) : null}
    </main>
  );
}
