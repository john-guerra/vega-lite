---
layout: docs
title: Impute
permalink: /docs/impute.html
---

To impute data in Vega-Lite, users can either use use an `impute` property of an [encoding field definition](#encoding) or an `impute` transform inside the [`transform`](#transform) array.

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

In this example, the data object where `"x"` is `3` and `"c"` is `1` is missing. So we can impute the missing data and give the imputed field a value of `0`.

<div class="vl-example" data-name="line_impute_value"></div>

We can also use a `method` on existing data points to generate the missing data.

<div class="vl-example" data-name="line_impute_method"></div>

The `frame` property of `impute` can be used to control the window over which the specified `method` is applied.

<div class="vl-example" data-name="line_impute_frame"></div>

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

The same charts can be created using the `impute transform` as well.

<div class="vl-example" data-name="line_impute_transform_value"></div>

<div class="vl-example" data-name="line_impute_transform_frame"></div>

Additional `keyvals` may be provided which will be used in addition to the `key` field.

<div class="vl-example" data-name="line_impute_keyvals"></div>

`keyvals` can also be a `sequence`.

<div class="vl-example" data-name="line_impute_keyvals_sequence"></div>
