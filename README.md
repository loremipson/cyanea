## :octopus: cyanea

Inspired by [palx](https://github.com/jxnblk/palx) and named after the Cyanea Octopus for its wild color changing abilities, cyanea is a color palette generator. You pass it a single value and it generates a full-spectrum color object.

```shell
yarn add cyanea
# or
npm i cyanea
```

```js
import cyanea from 'cyanea'

const colors = cyanea('rebeccapurple')
```

From here, cyanea generates a color object for each of the 12 hues in the color spectrum. Each hue has the following object created:

## The color object

```js
{
  violet: {
    isDark: true,
    hex: '#663399',
    rgb: ['101.99999999999996', '50.999999999999986', '153.00000000000003'],
    complemented: {
      isDark: true,
      hex: '#669933',
      rgb: ['102.00000000000003', '153.00000000000003', '50.999999999999986'],
    },
    variants: [
      {
        isDark: false,
        hex: '#F9F5FC',
        rgb: ['248.625', '245.4375', '251.81249999999997'],
        complemented: {
          isDark: false,
          hex: '#F9FCF5',
          rgb: ['248.625', '251.81249999999997', '245.4375'],
        },
      },
      // ... repeated for the remaining light/dark variants
    ],
  },
  // ... repeated for the remaining hues
}
```

### Available properties

| Key            | Type    | Description                                                                                                               |
|----------------|---------|---------------------------------------------------------------------------------------------------------------------------|
| `isDark`       | Boolean | Returns `true` or `false` for the current color. This is useful for determining if text on the color is light or dark.    |
| `hex`          | String  | The colors hex value. e.g. '#663399'                                                                                      |
| `rgb`          | Array   | The colors rgb values. This is useful if you need to set alpha transparency, you can use these values in css with`rgba()` |
| `complemented` | Object  | A repeat of the above `isDark`, `hex`, and `rgb` but all for the complemented spectrum color.                             |
| `variants`     | Array   | 20 different lightness levels. From "almost white" to "almost black", and everything in-between them.                     |

## How is this different from palx?

* cyanea depends on [`color`](https://github.com/Qix-/color) instead of `chroma-js`, which has a much smaller unpacked size
* cyanea provides more shade variations and goes to a darker scale. This is useful for creating light and dark modes for your themes.
* cyanea provides both hex and rgb options so you can easily play with `rgba()` when necessary. e.g. `box-shadow`, etc.
* For every generated color, cyanea provides a complementary color and a `isDark` boolean to help determine text colors for when the color is used as a background.
