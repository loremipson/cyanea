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
  voilet: {
    isDark: true,
    hex: '#663399',
    rgb: '101.99999999999996 50.999999999999986 153.00000000000003',
    variants: [
      {
        isDark: false,
        hex: '#F9F5FC',
        rgb: '248.625 245.4375 251.81249999999997',
      },
      // ... repeated for the remaining light/dark variants
    ],
  },
  // ... repeated for the remaining hues
}
```

The color you pass will be the first color returned in the object. Since you might not always know what the hue name is, a useful way to get the passed color value is:

```js
const colors = cyanea('#663399')
const passedColor = colors[Object.keys(colors)[0]]
```

### Available properties

| Key            | Type    | Description                                                                                                            |
|----------------|---------|------------------------------------------------------------------------------------------------------------------------|
| `isDark`       | Boolean | Returns `true` or `false` for the current color. This is useful for determining if text on the color is light or dark. |
| `hex`          | String  | The colors hex value. e.g. '#663399'                                                                                   |
| `rgb`          | String  | The colors rgb value. Can be used in styles with: `rgb(${colors.violet.rgb})`                                          |
| `variants`     | Array   | 40 different lightness levels. From "almost white" to "almost black", and everything in-between them.                  |

## How is this different from palx?

* cyanea depends on [`color`](https://github.com/Qix-/color) instead of `chroma-js`, which has a much smaller unpacked size
* cyanea provides more shade variations and goes to a darker scale. This is useful for creating light and dark modes for your themes.
* For every generated color, cyanea provides a `isDark` boolean to help determine text colors for when the color is used as a background.
