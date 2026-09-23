export interface CurvePoint {
  hours: number;
  total: number;
  x: number;
  y: number;
}

const RAW_POINTS: [hours: number, total: number][] = [
  [1, 12], [2, 22], [3, 30], [4, 38], [5, 45], [6, 50], [7, 55], [8, 60], [12, 90],
];

const WIDTH = 620;
const HEIGHT = 320;
const PAD_LEFT = 44;
const PAD_RIGHT = 24;
const PAD_TOP = 54;
const PAD_BOTTOM = 40;
const RATE_LOW = 7;
const RATE_HIGH = 12.6;

const x = (hours: number) => PAD_LEFT + ((hours - 1) / 11) * (WIDTH - PAD_LEFT - PAD_RIGHT);
const y = (rate: number) =>
  PAD_TOP + ((RATE_HIGH - rate) / (RATE_HIGH - RATE_LOW)) * (HEIGHT - PAD_TOP - PAD_BOTTOM);

export const CURVE_VIEWBOX = `0 0 ${WIDTH} ${HEIGHT}`;
export const CURVE_LAYOUT = { width: WIDTH, height: HEIGHT, padBottom: PAD_BOTTOM };

export const CURVE_POINTS: CurvePoint[] = RAW_POINTS.map(([hours, total]) => ({
  hours,
  total,
  x: x(hours),
  y: y(total / hours),
}));

export const CURVE_PATH = CURVE_POINTS.map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");

export const CURVE_AREA_PATH =
  `${CURVE_PATH} L ${CURVE_POINTS[CURVE_POINTS.length - 1].x.toFixed(1)} ${HEIGHT - PAD_BOTTOM} ` +
  `L ${CURVE_POINTS[0].x.toFixed(1)} ${HEIGHT - PAD_BOTTOM} Z`;

export const CURVE_GRID_LINES = [7, 8, 9, 10, 11, 12].map((rate) => ({ rate, y: y(rate) }));

export function formatRate(total: number, hours: number): string {
  return (total / hours).toFixed(2).replace(".", ",") + " lei pe oră";
}

export function formatHours(hours: number): string {
  return hours === 1 ? "1 oră" : `${hours} ore`;
}
