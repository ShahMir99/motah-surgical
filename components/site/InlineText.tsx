import { Fragment } from "react";

/**
 * Renders text written in the admin: a new line becomes a line break and
 * **double asterisks** make words bold. Nothing is treated as HTML.
 */
export function InlineText({ text, boldClassName }: { text: string; boldClassName?: string }) {
  return (
    <>
      {text.split("\n").map((line, i) => (
        <Fragment key={i}>
          {i > 0 && <br />}
          {line.split(/\*\*(.+?)\*\*/g).map((part, j) =>
            j % 2 === 1 ? (
              <b key={j} className={boldClassName}>
                {part}
              </b>
            ) : (
              <Fragment key={j}>{part}</Fragment>
            )
          )}
        </Fragment>
      ))}
    </>
  );
}
