import type { ReactElement } from 'react';
import type { Bridge } from '../types';
import { diagramSpansOf, layoutSpans } from '../lib/spans';
import { choosePylonSupports } from '../lib/bridge3d';
import { fmtMeters, fmtNum, STRINGS, type Lang } from '../lib/i18n';

const VB_W = 1000;
const H = 84;
const DECK_Y = 60;
const WATER_Y = 78;
const ASSUMED_PX_W = 368; // approximate rendered width inside a 400px panel

/** To-scale (horizontally) elevation drawing built from span_arrangement (design.md §6.2). */
export function SpanDiagram({ bridge, lang, className }: { bridge: Bridge; lang: Lang; className?: string }) {
  const spans = diagramSpansOf(bridge);
  if (!spans) return null;
  const { mainStart, mainEnd } = layoutSpans(spans, bridge.cable_stayed_spans ?? 1);
  const total = spans.reduce((a, b) => a + b, 0);
  const sx = (m: number) => (m / total) * VB_W;
  // auxiliary piers (model3d.auxiliary_piers_m, measured from the unit start) when the diagram uses model3d spans
  const usesModelSpans = !!bridge.model3d?.spans_m && bridge.model3d.spans_m.length >= 2;
  const aux = usesModelSpans ? (bridge.model3d?.auxiliary_piers_m ?? []).filter((a) => a > 0 && a < total) : [];
  const edges = spans.reduce<number[]>((acc, s) => [...acc, acc[acc.length - 1] + s], [0]);
  const mainLen = Math.max(...spans.slice(mainStart, mainEnd + 1));
  const pylonH = Math.max(18, Math.min(DECK_Y - 4, 0.28 * mainLen * (ASSUMED_PX_W / total)));
  // Pylon edge indices: from model3d's pylon count (same rule as the 3D model), so single-pylon
  // bridges get one pylon, not one at each end of the main span.
  const pylonCount = bridge.model3d?.pylon_heights_m?.length;
  const pylonIdx = pylonCount
    ? choosePylonSupports(spans, pylonCount).map((s) => s + 1)
    : Array.from({ length: mainEnd - mainStart + 2 }, (_, i) => mainStart + i).filter(
        (e) => e > 0 && e < spans.length,
      );
  const isPylon = new Set(pylonIdx);
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
      // share the span with a pylon at its far end; otherwise stays reach across most of it
      const farEdge = side < 0 ? pi - 1 : pi + 1;
      const reach = sx(spans[spanIdx]) * (isPylon.has(farEdge) ? 0.5 : 0.92);
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

  // navigation clearance: vertical dimension (schematic, not to scale) at the main span's centre
  const navH = bridge.nav_clearance?.height_m;
  const navX = sx((edges[mainStart] + edges[mainEnd + 1]) / 2) + 14;
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
          {aux.map((a) => (
            <line key={`aux${a}`} x1={sx(a)} x2={sx(a)} y1={DECK_Y} y2={DECK_Y + 14} className="sd-pier sd-aux" {...ve} />
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
        {navH && (
          <g className="sd-clearance">
            <line x1={0} x2={VB_W} y1={WATER_Y} y2={WATER_Y} className="sd-water" strokeDasharray="6 4" {...ve} />
            <line x1={navX} x2={navX} y1={WATER_Y} y2={DECK_Y + 2} className="sd-dim" {...ve} />
            <line x1={navX - 6} x2={navX + 6} y1={WATER_Y} y2={WATER_Y} className="sd-dim" {...ve} />
            <line x1={navX - 6} x2={navX + 6} y1={DECK_Y + 2} y2={DECK_Y + 2} className="sd-dim" {...ve} />
          </g>
        )}
      </svg>
      {navH && (
        <span className="sd-clearance-label" style={{ left: `${(navX / VB_W) * 100}%` }}>
          H {fmtMeters(navH, lang)}
        </span>
      )}
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
