import {BaseLegend, BaseLegendConfig, Legend as VgLegend, LegendDirection, LegendOrient} from 'vega';
import {DateTime} from './datetime';
import {Guide, GuideEncodingEntry, VlOnlyGuideConfig} from './guide';
import {Flag, flagKeys} from './util';

export interface LegendConfig extends BaseLegendConfig, VlOnlyGuideConfig {}

/**
 * Properties of a legend or boolean flag for determining whether to show it.
 */
export interface Legend extends BaseLegend, Guide {
  /**
   * Mark definitions for custom legend encoding.
   *
   * @hide
   */
  encoding?: LegendEncoding;

  /**
   * The desired number of tick values for quantitative legends.
   */
  tickCount?: number;

  /**
   * Explicitly set the visible legend values.
   */
  values?: number[] | string[] | boolean[] | DateTime[];

  /**
   * The type of the legend. Use `"symbol"` to create a discrete legend and `"gradient"` for a continuous color gradient.
   *
   * __Default value:__ `"gradient"` for non-binned quantitative fields and temporal fields; `"symbol"` otherwise.
   */
  type?: 'symbol' | 'gradient';

  /**
   * A non-positive integer indicating z-index of the legend.
   * If zindex is 0, legend should be drawn behind all chart elements.
   * To put them in front, use zindex = 1.
   *
   * @TJS-type integer
   * @minimum 0
   */
  zindex?: number;

  /**
   * The direction of the legend, one of `"vertical"` (default) or `"horizontal"`.
   */
  direction?: LegendDirection;

  /**
   * The orientation of the legend, which determines how the legend is positioned within the scene. One of "left", "right", "top-left", "top-right", "bottom-left", "bottom-right", "none".
   *
   * __Default value:__ `"right"`
   */
  orient?: LegendOrient;
}

export interface LegendEncoding {
  /**
   * Custom encoding for the legend container.
   * This can be useful for creating legend with custom x, y position.
   */
  legend?: GuideEncodingEntry;

  /**
   * Custom encoding for the legend title text mark.
   */
  title?: GuideEncodingEntry;

  /**
   * Custom encoding for legend label text marks.
   */
  labels?: GuideEncodingEntry;

  /**
   * Custom encoding for legend symbol marks.
   */
  symbols?: GuideEncodingEntry;

  /**
   * Custom encoding for legend gradient filled rect marks.
   */
  gradient?: GuideEncodingEntry;
}

export const defaultLegendConfig: LegendConfig = {};

const COMMON_LEGEND_PROPERTY_INDEX: Flag<keyof (VgLegend | Legend)> = {
  clipHeight: 1,
  columnPadding: 1,
  columns: 1,
  cornerRadius: 1,
  direction: 1,
  fillColor: 1,
  format: 1,
  gradientLength: 1,
  gradientStrokeColor: 1,
  gradientStrokeWidth: 1,
  gradientThickness: 1,
  gridAlign: 1,
  labelAlign: 1,
  labelBaseline: 1,
  labelColor: 1,
  labelFont: 1,
  labelFontSize: 1,
  labelFontWeight: 1,
  labelLimit: 1,
  labelOffset: 1,
  labelOverlap: 1,
  offset: 1,
  orient: 1,
  padding: 1,
  rowPadding: 1,
  strokeColor: 1,
  strokeWidth: 1,
  symbolFillColor: 1,
  symbolSize: 1,
  symbolStrokeColor: 1,
  symbolStrokeWidth: 1,
  symbolType: 1,
  tickCount: 1,
  title: 1,
  titleAlign: 1,
  titleBaseline: 1,
  titleColor: 1,
  titleFont: 1,
  titleFontSize: 1,
  titleFontWeight: 1,
  titleLimit: 1,
  titlePadding: 1,
  type: 1,
  values: 1,
  zindex: 1
};

const VG_LEGEND_PROPERTY_INDEX: Flag<Exclude<keyof VgLegend, 'strokeDash'>> = {
  ...COMMON_LEGEND_PROPERTY_INDEX,
  // channel scales
  opacity: 1,
  shape: 1,
  stroke: 1,
  fill: 1,
  size: 1,
  // encode
  encode: 1
};

export const LEGEND_PROPERTIES = flagKeys(COMMON_LEGEND_PROPERTY_INDEX);

export const VG_LEGEND_PROPERTIES = flagKeys(VG_LEGEND_PROPERTY_INDEX);
