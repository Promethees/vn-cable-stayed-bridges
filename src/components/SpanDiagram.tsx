import type { ReactElement } from 'react';
import type { Bridge } from '../types';
import { diagramSpansOf, layoutSpans } from '../lib/spans';
import { fmtMeters, fmtNum, STRINGS, type Lang } from '../lib/i18n';

const VB_W = 1000;
const H = 84;
const DECK_Y = 60;
const ASSUMED_PX_W = 368; // approximate rendered width inside a 400px panel

/** To-scale (horizontally) elevation drawing built from span_arrangement (design.md §6.2). */
export function SpanDiagram({ bridge, lang, className }: { bridge: Bridge; lang: Lang; className?: string }) {
  const spans = diagramSpansOf(bridge);
  if (!spans) return null;
  const { mainStart, mainEnd } = layoutSpans(spans, bridge.cable_stayed_spans ?? 1);
  const total = spans.reduce((a, b) => a + b, 0);
  const sx = (m: number) => (m / total) * VB_W;
  const edges = spans.reduce<number[]>((acc, s) => [...acc, acc[acc.length - 1] + s], [0]);
  const mainLen = Math.max(...spans.slice(mainStart, mainEnd + 1));
  const pylonH = Math.max(18, Math.min(DECK_Y - 4, 0.28 * mainLen * (ASSUMED_PX_W / total)));
  const pylonIdx = Array.from({ length: mainEnd - mainStart + 2 }, (_, i) => mainStart + i);
  const cableFrac = bridge.status === 'under_construction' ? 0.6 : 1;
  const planned = bridge.status === 'planned';
  const ve = { vectorEffect: 'non-scaling-stroke' as const };
  const mainDash = bridge.status === 'completed' ? undefined : bridge.status === 'under_construction' ? '8 5' : '1.5 4';

  const cables: ReactElement[] = [];
  for (const pi of pylonIdx) {
    const x = sx(edges[pi]);
    const top = DECK_Y - pylonH + 4;
    for (const side of [-1, 1] as const) {
      const spanIdx = side < 0 ? pi - 1 : pi;
      if (spanIdx < 0 || spanIdx >= spans.length) continue;
      const reach = sx(spans[spanIdx]) / 2;
      for (let j = 1; j <= 5; j++) {
        const x2 = x + side * reach * (j / 5);
        cables.push(
          <line
            key={`${pi}${side}${j}`}
            x1={x}
            y1={top}
            x2={x + (x2 - x) * cableFrac}
            y2={top + (DECK_Y - top) * cableFrac}
            className="sd-cable"
            {...ve}
          />,
        );
      }
    }
  }

  const arrText = spans.map((s) => fmtNum(s, lang)).join(' + ') + ' m';
  return (
    <figure
      className={`span-diagram${className ? ` ${className}` : ''}`}
      role="img"
      aria-label={STRINGS[lang].diagramAria(arrText, fmtMeters(mainLen, lang))}
      style={planned ? { opacity: 0.6 } : undefined}
    >
      <svg viewBox={`0 0 ${VB_W} ${H}`} preserveAspectRatio="none" width="100%" height={H} aria-hidden="true">
        <g strokeDasharray={planned ? '4 3' : undefined}>
          {cables}
          {pylonIdx.map((pi) => (
            <line key={pi} x1={sx(edges[pi])} x2={sx(edges[pi])} y1={DECK_Y - pylonH} y2={H - 6} className="sd-pylon" {...ve} />
          ))}
          {edges.map((e, i) => (
            <line key={`p${i}`} x1={sx(e)} x2={sx(e)} y1={DECK_Y} y2={DECK_Y + 10} className="sd-pier" {...ve} />
          ))}
          <line x1={0} x2={VB_W} y1={DECK_Y} y2={DECK_Y} className="sd-deck" {...ve} />
        </g>
        <line
          x1={sx(edges[mainStart])}
          x2={sx(edges[mainEnd + 1])}
          y1={DECK_Y}
          y2={DECK_Y}
          className="sd-main"
          strokeDasharray={mainDash}
          {...ve}
        />
      </svg>
      <div className="sd-labels" aria-hidden="true">
        {spans.map((s, i) =>
          s / total >= 0.08 ? (
            <span key={i} style={{ left: `${((edges[i] + s / 2) / total) * 100}%` }}>
              {fmtNum(s, lang)}
            </span>
          ) : null,
        )}
      </div>
    </figure>
  );
}
