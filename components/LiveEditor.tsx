"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A live code editor panel.
 *
 * This is a real text surface, not a picture: the code is typed character by
 * character with syntax colouring, a cursor, line numbers, and a test run in
 * the terminal strip. Text stays crisp at any zoom and costs nothing to paint
 * compared to a WebGL scene.
 *
 * The timer only runs while the panel is on screen, and the whole thing
 * renders its final state immediately under prefers-reduced-motion.
 */

type Token = { text: string; tone: keyof typeof tones };

const tones = {
  plain: "text-[#c8d2dc]",
  keyword: "text-[#93b4ff]",
  type: "text-[#7fd8cf]",
  string: "text-[#e0b184]",
  comment: "text-[#8494a1]",
  fn: "text-[#e8d9a0]",
  number: "text-[#d3a8f5]",
} as const;

const snippets: { file: string; code: Token[] }[] = [
  {
    file: "ApproveHandler.cs",
    code: [
      { text: "using MediatR;\n\n", tone: "keyword" },
      { text: "public sealed class ", tone: "keyword" },
      { text: "ApproveHandler\n    : ", tone: "type" },
      { text: "IRequestHandler", tone: "type" },
      { text: "<Approve, Result>\n{\n", tone: "plain" },
      { text: "    public async ", tone: "keyword" },
      { text: "Task<Result> ", tone: "type" },
      { text: "Handle", tone: "fn" },
      { text: "(\n        Approve cmd, CancellationToken ct)\n    {\n", tone: "plain" },
      { text: "        var ", tone: "keyword" },
      { text: "entity = ", tone: "plain" },
      { text: "await ", tone: "keyword" },
      { text: "_repo.FindAsync", tone: "fn" },
      { text: "(cmd.Code, ct);\n\n", tone: "plain" },
      { text: "        if ", tone: "keyword" },
      { text: "(entity is null)\n            ", tone: "plain" },
      { text: "return ", tone: "keyword" },
      { text: "Result.NotFound", tone: "fn" },
      { text: "(cmd.Code);\n\n", tone: "plain" },
      { text: "        entity.Audit", tone: "fn" },
      { text: "(cmd.Actor, cmd.Before);\n", tone: "plain" },
      { text: "        await ", tone: "keyword" },
      { text: "_unit.SaveChangesAsync", tone: "fn" },
      { text: "(ct);\n\n", tone: "plain" },
      { text: "        return ", tone: "keyword" },
      { text: "Result.Ok", tone: "fn" },
      { text: "(entity);\n    }\n}", tone: "plain" },
    ],
  },
  {
    file: "ParametersController.cs",
    code: [
      { text: "// 43 parameter modules, one contract\n", tone: "comment" },
      { text: "[", tone: "plain" },
      { text: "HttpPost", tone: "fn" },
      { text: '("/api/parameters/{code}/approve")]\n', tone: "string" },
      { text: "public async ", tone: "keyword" },
      { text: "Task<IActionResult> ", tone: "type" },
      { text: "Approve", tone: "fn" },
      { text: "(\n    ", tone: "plain" },
      { text: "string ", tone: "type" },
      { text: "code,\n    [FromBody] ApprovalDto dto)\n{\n", tone: "plain" },
      { text: "    if ", tone: "keyword" },
      { text: "(!_auth.CanApprove", tone: "fn" },
      { text: "(code, dto.Actor))\n        ", tone: "plain" },
      { text: "return ", tone: "keyword" },
      { text: "Forbid", tone: "fn" },
      { text: "();\n\n", tone: "plain" },
      { text: "    var ", tone: "keyword" },
      { text: "result = ", tone: "plain" },
      { text: "await ", tone: "keyword" },
      { text: "_mediator.Send", tone: "fn" },
      { text: "(\n        ", tone: "plain" },
      { text: "new ", tone: "keyword" },
      { text: "Approve(code, dto), ct);\n\n", tone: "plain" },
      { text: "    return ", tone: "keyword" },
      { text: "result.IsSuccess\n        ? ", tone: "plain" },
      { text: "Ok", tone: "fn" },
      { text: "(result.Value)\n        : ", tone: "plain" },
      { text: "BadRequest", tone: "fn" },
      { text: "(result.Error);\n}", tone: "plain" },
    ],
  },
  {
    file: "ParameterRepository.cs",
    code: [
      { text: "public ", tone: "keyword" },
      { text: "async Task<PagedResult<Parameter>> ", tone: "type" },
      { text: "ListAsync", tone: "fn" },
      { text: "(\n    ParameterQuery query, CancellationToken ct)\n{\n", tone: "plain" },
      { text: "    var ", tone: "keyword" },
      { text: "sql = ", tone: "plain" },
      { text: '"SELECT * FROM parameters WHERE 1=1"', tone: "string" },
      { text: ";\n\n", tone: "plain" },
      { text: "    if ", tone: "keyword" },
      { text: "(query.ParentCode ", tone: "plain" },
      { text: "is not null", tone: "keyword" },
      { text: ")\n        sql += ", tone: "plain" },
      { text: '" AND parent_code = @parent"', tone: "string" },
      { text: ";\n\n", tone: "plain" },
      { text: "    return ", tone: "keyword" },
      { text: "await ", tone: "keyword" },
      { text: "_db.QueryAsync", tone: "fn" },
      { text: "<Parameter>(\n        sql,\n        ", tone: "plain" },
      { text: "new ", tone: "keyword" },
      { text: "{ query.ParentCode }, ct);\n}", tone: "plain" },
    ],
  },
];

function flatten(code: Token[]) {
  const chars: { ch: string; tone: keyof typeof tones }[] = [];
  for (const token of code) {
    for (const ch of token.text) chars.push({ ch, tone: token.tone });
  }
  return chars;
}

export default function LiveEditor() {
  const host = useRef<HTMLDivElement>(null);
  const [snippet, setSnippet] = useState(0);
  const [typed, setTyped] = useState(0);
  // Starts false: the panel is below the fold on mobile, and the observer
  // below is what turns typing on. Starting at `true` let a stale interval
  // run before the observer reported the real state.
  const [visible, setVisible] = useState(false);
  const [caret, setCaret] = useState(true);
  const [reduce, setReduce] = useState(false);

  const chars = flatten(snippets[snippet].code);
  const total = chars.length;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(mq.matches);
    const onChange = () => setReduce(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const node = host.current;
    if (!node) return;

    // `rootMargin` starts typing slightly before the panel is fully on screen,
    // so the first characters are already appearing when it comes into view.
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0, rootMargin: "120px 0px" },
    );
    io.observe(node);

    // The observer can miss a panel that is already visible at mount on a
    // short viewport, so seed the state from the real geometry once.
    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight + 120 && rect.bottom > 0) {
      setVisible(true);
    }

    return () => io.disconnect();
  }, []);

  // A new snippet always starts from zero. Without this the next snippet
  // would begin already "complete" because `typed` still held the previous
  // length.
  useEffect(() => {
    setTyped(0);
  }, [snippet]);

  useEffect(() => {
    if (reduce) {
      setTyped(total);
      return;
    }
    if (!visible) return;

    // One interval per snippet. It clears itself the moment the snippet is
    // complete, and a single guarded timeout hands over to the next one.
    //
    // The earlier version scheduled the hand-over from inside the state
    // updater, which runs on every tick: dozens of timeouts queued up and all
    // fired together, which is what made the panel glitch at the end.
    let advanced = false;
    let advanceTimer: number | undefined;

    const id = window.setInterval(() => {
      setTyped((n) => {
        if (n >= total) {
          window.clearInterval(id);
          if (!advanced) {
            advanced = true;
            advanceTimer = window.setTimeout(() => {
              setSnippet((s) => (s + 1) % snippets.length);
            }, 2600);
          }
          return total;
        }
        return n + 1;
      });
    }, 22);

    return () => {
      advanced = true;
      window.clearInterval(id);
      if (advanceTimer) window.clearTimeout(advanceTimer);
    };
  }, [total, visible, reduce, snippet]);

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => setCaret((c) => !c), 530);
    return () => window.clearInterval(id);
  }, [reduce]);

  // Before the panel is first seen, show the opening of the file. An empty
  // box reads as broken on mobile, where the panel sits below the fold.
  const introLines = 6;
  const shown = reduce
    ? total
    : visible
      ? Math.min(typed, total)
      : Math.min(chars.length, introLines * 42);
  type Span = { tone: keyof typeof tones; text: string };
  const lines: { num: number; spans: Span[] }[] = [{ num: 1, spans: [] }];
  let used = 0;

  for (let i = 0; i < chars.length && used < shown; i++) {
    const { ch, tone } = chars[i];
    if (ch === "\n") {
      lines.push({ num: lines.length + 1, spans: [] });
    } else {
      const current = lines[lines.length - 1];
      const last = current.spans[current.spans.length - 1];
      if (last && last.tone === tone) {
        last.text += ch;
      } else {
        current.spans.push({ tone, text: ch });
      }
    }
    used += 1;
  }

  const done = shown >= total;

  return (
    <div
      ref={host}
      className="flex h-full w-full flex-col overflow-hidden bg-[#0a1016] text-[13px] leading-[1.65]"
    >
      {/* tab bar */}
      <div className="flex shrink-0 items-center gap-3 border-b border-[#1b262f] bg-[#0e161d] px-4 py-2.5">
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="size-2.5 rounded-full bg-[#2c3a44]" />
          <span className="size-2.5 rounded-full bg-[#2c3a44]" />
          <span className="size-2.5 rounded-full bg-[#2c3a44]" />
        </div>
        <span className="ml-2 min-w-0 truncate font-mono text-[11px] text-[#9aa9b5]">
          {snippets[snippet].file}
        </span>
        {/* Decorative tags drop out first on narrow screens so the file name
            and the status word always keep their space. */}
        <span className="hidden shrink-0 font-mono text-[11px] text-[#7d8b97] sm:inline">
          SAMCO
        </span>
        <span className="ml-auto shrink-0 font-mono text-[10px] tracking-wide text-[#8b99a4]">
          {done ? "saved" : "typing"}
        </span>
      </div>

      <div className="flex min-h-0 flex-1">
        {/* gutter */}
        <div
          aria-hidden="true"
          className="shrink-0 select-none border-r border-[#141d24] bg-[#0b1218] px-2 py-3 text-right font-mono text-[10px] leading-[1.6] text-[#79868f] sm:px-3 sm:py-4 sm:text-[11px] sm:leading-[1.65]"
        >
          {lines.map((l) => (
            <div key={l.num}>{l.num}</div>
          ))}
        </div>

        {/* code */}
        <pre className="min-h-0 flex-1 overflow-x-auto overflow-y-hidden px-3 pt-3 pb-1 font-mono text-[10.5px] leading-[1.6] [scrollbar-width:thin] sm:px-4 sm:pt-4 sm:text-[12.5px] sm:leading-[1.65]">
          <code>
            {lines.map((line, i) => (
              <div key={i} className="whitespace-pre">
                {line.spans.map((span, j) => (
                  <span key={j} className={tones[span.tone]}>
                    {span.text}
                  </span>
                ))}
                {i === lines.length - 1 && !done && caret ? (
                  <span className="ml-px inline-block h-[15px] w-[7px] translate-y-[2px] bg-[#9dbcff]" />
                ) : null}
                {i === lines.length - 1 && !done ? "​" : null}
              </div>
            ))}
          </code>
        </pre>
      </div>

      {/* terminal */}
      <div className="shrink-0 border-t border-[#1b262f] bg-[#070c10] px-4 py-2.5 font-mono text-[11px] leading-relaxed">
        <p className="text-[#8b99a4]">
          <span className="text-[#93a1ac]">$</span> dotnet test --filter
          ApproveHandler
        </p>
        <p className={done ? "text-[#8ad6a8]" : "text-[#8b99a4]"}>
          {done
            ? "Passed!  - Failed: 0, Passed: 16, Skipped: 0  (1.24s)"
            : "Running tests..."}
        </p>
      </div>

      {/* status bar */}
      <div className="flex shrink-0 items-center justify-between border-t border-[#1b262f] bg-[#0e1820] px-4 py-1.5 font-mono text-[10px] text-[#93a1ac]">
        <span>main*</span>
        <span className="flex items-center gap-2 sm:gap-4">
          <span className="text-[#8fb0ff]">0 errors</span>
          <span className="hidden min-[360px]:inline">C#</span>
          <span className="hidden min-[400px]:inline">UTF-8</span>
          <span>Ln {lines.length}</span>
        </span>
      </div>
    </div>
  );
}
