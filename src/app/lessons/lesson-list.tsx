import type { Lesson } from "@content/lessons/lessons";
import { Card } from "@/components/card/card";
import { Sprout, sproutStage } from "@/design/illustrations";
import { lessonWords as words } from "../_strings/lessons";

type LessonListProps = { lessons: Lesson[]; readIds: string[]; onOpen: (id: string) => void };

// The list of lessons with a sprout that grows as they are read.
export function LessonList({ lessons, readIds, onOpen }: LessonListProps) {
  const read = lessons.filter((lesson) => readIds.includes(lesson.id)).length;
  return (
    <>
      <Card tone="calm" className="flex items-center gap-4">
        <Sprout stage={sproutStage(read, lessons.length)} className="h-20 w-20 shrink-0" label={words.sproutLabel(read, lessons.length)} />
        <div>
          <p className="text-xl font-extrabold">{words.progress(read, lessons.length)}</p>
          {read === lessons.length && <p>{words.allRead}</p>}
        </div>
      </Card>
      <ul className="flex flex-col gap-4">
        {lessons.map((lesson) => {
          const isRead = readIds.includes(lesson.id);
          return (
            <li key={lesson.id}>
              <button
                type="button"
                onClick={() => onOpen(lesson.id)}
                className="flex min-h-12 w-full flex-col gap-1 rounded-soft border-2 border-lavender bg-surface px-5 py-4 text-left shadow-soft hover:bg-lavender-soft"
              >
                <span className="text-xl font-extrabold">{lesson.title}</span>
                <span className={isRead ? "font-bold text-sage-deep" : "text-ink-soft"}>
                  {isRead ? `${words.done} · ${words.readAgain}` : `${words.minute} · ${words.read}`}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </>
  );
}
