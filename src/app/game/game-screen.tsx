"use client";

import { useState } from "react";
import { gameWords as words } from "@content/lessons/game";
import { Button } from "@/components/button/button";
import { Card } from "@/components/card/card";
import { NextStep } from "@/components/layout/next-step";
import { Sprout, sproutStage } from "@/design/illustrations";
import { clueIds, GameBoard, nextHint } from "./game-board";

// A gentle game: no clock, no lives, nothing to lose. Start, look around, stop whenever.
export function GameScreen() {
  const [started, setStarted] = useState(false);
  const [tapped, setTapped] = useState<string[]>([]);
  const [hint, setHint] = useState<string | null>(null);
  const found = clueIds.filter((id) => tapped.includes(id)).length;
  const finished = found === clueIds.length;

  function tap(id: string) {
    if (!tapped.includes(id)) setTapped([...tapped, id]);
    setHint(null);
  }
  function restart() {
    setTapped([]);
    setHint(null);
    window.scrollTo(0, 0);
  }

  if (!started) {
    return (
      <>
        <Card className="flex flex-col items-start gap-3">
          <Sprout stage={1} className="h-20 w-20" />
          <h1 className="text-3xl font-extrabold leading-tight">{words.title}</h1>
          <p className="text-xl text-ink-soft">{words.intro}</p>
        </Card>
        <NextStep>
          <Button onClick={() => setStarted(true)}>{words.start}</Button>
        </NextStep>
      </>
    );
  }
  return (
    <>
      <h1 className="text-3xl font-extrabold leading-tight">{words.title}</h1>
      <Card tone="calm" className="sticky top-2 z-10 flex items-center gap-3">
        <Sprout stage={sproutStage(found, clueIds.length)} className="h-14 w-14 shrink-0" label={words.sproutLabel(found, clueIds.length)} />
        <p role="status" className="text-xl font-extrabold">{words.found(found, clueIds.length)}</p>
      </Card>
      <GameBoard tapped={tapped} onTap={tap} />
      {hint && (
        <Card tone="hint">
          <p role="status"><span className="font-bold">{words.hintTitle}: </span>{hint}</p>
        </Card>
      )}
      {finished ? (
        <>
          <Card tone="calm" className="flex flex-col items-start gap-2">
            <Sprout stage={4} className="h-24 w-24" />
            <h2 className="text-2xl font-extrabold">{words.endTitle}</h2>
            <p>{words.endText}</p>
          </Card>
          <NextStep>
            <Button href="/upload">{words.ownBill}</Button>
            <Button tone="quiet" onClick={restart}>{words.again}</Button>
          </NextStep>
        </>
      ) : (
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button tone="second" onClick={() => setHint(nextHint(tapped))}>{words.hint}</Button>
          <Button tone="quiet" onClick={() => setTapped([...new Set([...tapped, ...clueIds])])}>{words.showAll}</Button>
        </div>
      )}
    </>
  );
}
