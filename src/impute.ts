import {ImputeMethods} from './vega.schema';

export interface ImputeParams {
  /**
   * The imputation method to use for the field value of imputed data objects.
   * One of `value`, `mean`, `median`, `max` or `min`.
   *
   * __Default value:__  `"value"`
   */
  method?: ImputeMethods;

  /**
   * The field value to use when the imputation `method` is `"value"`.
   */
  value?: any;

  /**
   * A frame specification as a two-element array indicating how the sliding window should proceed. The array entries should either be a number indicating the offset from the current data object, or null to indicate unbounded rows preceding or following the current data object. The default value is `[null, null]`, indicating that the sliding window includes all objects. The value `[-5, 5]` indicates that the window should include five objects preceding and five objects following the current object. Finally, `[null, null]` indicates that the frame should always include all data objects.
   *
   * __Default value:__:  `[null, null]` (includes all objects)
   */
  frame?: (null | number)[];
}
