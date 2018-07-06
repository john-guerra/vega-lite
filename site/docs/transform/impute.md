---
layout: docs
title: Impute
permalink: /docs/impute.html
---

To impute missing data in Vega-Lite, you can either use the `impute` transform either inside an [encoding field definition](#encoding) or inside an [`transform`](#transform) array.

Impute transform in Vega-Lite groups data and determines missing values of the `key` field within each group.  For each missing value in each group, a new tuple will be generated
with the `impute`d field generated based on specified imputation method (by using a constant `value` or by calculating statistics such as mean within each group).

## Documentation Overview
{:.no_toc}

- TOC
{:toc}

{:#encoding}
## Impute in Encoding Field Definition

{: .suppress-error}
```json
// A Single View Specification
{
  "data": ... ,
  "mark": ... ,
  "encoding": {
    "x": {
      "field": ...,
      "type": "quantitative",
      "impute": ...,               // Impute
      ...
    },
    "y": ...,
    ...
  },
  ...
}
```

The `impute` property of [a field definition](encoding.html#field-def) can be used to generate new data objects in place of the missing data.

{% include table.html props="value,method,frame" source="ImputeParams" %}

For `impute` in encoding, grouping fields and the key field (for identifying missing values) are automatically determined. Values are automatically grouped by the specified fields of [mark property channels](encoding.html#mark-prop), [key channel](encoding.html#key) and [detail channel](encoding.html#detail). If x-field is `impute`d, y-field is the key field. Basically, any missing y-value in each group will lead to a new tuple imputed, and vice versa.

In this example, the data object where `"x"` is `3` and `"c"` is `1` is missing. So we can impute the missing data and give the imputed field a value of `0`.

<div class="vl-example" data-name="line_impute_value"></div>

We can also use a `method` on existing data points to generate the missing data.
Here, we set  `method` = `mean`. The values are grouped by the `field` of the `color` encoding and the imputation is performed group by group.

<div class="vl-example" data-name="line_impute_method"></div>

The `frame` property of `impute` can be used to control the window over which the specified `method` is applied.
Here, the `frame` is `[-2, 2]` which indicates that the window should include two objects preceding and two objects following the current object.

<div class="vl-example" data-name="line_impute_frame"></div>

If `frame` is unspecified, then there is no frame. This is equivalent to `[null, null]` which essentially means `(-Inf, Inf)` i.e., the window includes all objects in each group.

{:#transform}
## Impute Transform

{: .suppress-error}
```json
// A View Specification
{
  ...
  "transform": [
    {
      // Impute Transform
      "impute": ...,
      "key": ...,
      "keyvals": ...,
      "groupby": [...]
    }
    ...
  ],
  ...
}
```

{% include table.html props="impute,key,keyvals,groupby" source="ImputeTransform" %}

The same charts can be created using the `impute` transform as well.
Here, we have to manually specify the `key` and `groupby` fields which were inferred automatically in the `impute` property of the `encoding` field definition.

<div class="vl-example" data-name="line_impute_transform_value"></div>

<div class="vl-example" data-name="line_impute_transform_frame"></div>

`keyvals` may be provided which will be used in addition to the key values observed within the input data. If not provided, the values will be derived from all unique values of the `key` field.
If `groupby` is not specified, `keyvals` _must_ be specified. It can either be an array or an [object](#sequence-def) which defines a sequence.

In this example, we use array `keyvals`.
<div class="vl-example" data-name="line_impute_keyvals"></div>

{:#sequence-def}
### Impute Sequence Keyvals
To define a sequence, an object with the following properties must be specified.

{% include table.html props="start,stop,step" source="ImputeSequence" %}
<div class="vl-example" data-name="line_impute_keyvals_sequence"></div>
