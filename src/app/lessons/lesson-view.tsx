import type { Lesson } from "@content/lessons/lessons";
import { Button } from "@/components/button/button";
import { Card } from "@/components/card/card";
import { SampleTag } from "@/components/card/sample-tag";
import { WithHints } from "@/components/hint/with-hints";
import { NextStep } from "@/components/layout/next-step";
import { lessonWords as words } from "../_strings/lessons";

// One lesson, already filled with the person's own example. One minute, one button.
export function LessonView({ lesson, isSample, onDone }: { lesson: Lesson; isSample: boolean; onDone: () => void }) {
  return (
    <>
      <Card className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2 text-ink-soft">
          {isSample && <SampleTag />}
          <span>{words.minute}</span>
        </div>
        <h1 className="text-3xl font-extrabold leading-tight">{lesson.title}</h1>
        {lesson.body.map((paragraph, index) => (
          <p key={index} className={index === 1 ? "rounded-soft bg-amber-soft p-4" : ""}>
            <WithHints text={paragraph} />
          </p>
        ))}
        <p className="rounded-soft bg-sage-soft p-4">
          <span className="font-bold">{words.takeaway}: </span>
          <WithHints text={lesson.takeaway} />
        </p>
      </Card>
      <NextStep>
        <Button onClick={onDone}>{words.finish}</Button>
      </NextStep>
    </>
  );
}
