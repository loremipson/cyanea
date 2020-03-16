## :octopus: cyanea

Inspired by [palx](https://github.com/jxnblk/palx) and named after the Cyanea Octopus for its wild color changing abilities, cyanea is a color palette generator. You pass it a single value and it generates a full-spectrum color object, complete with `isDark` and complemented color values.

```shell
yarn add cyanea
# or
npm i cyanea
```

```js
import cyanea from 'cyanea'

cont colors = cyanea('rebeccapurple')
```

From here, cyanea generates a color object for each of the 12 hues in the color spectrum. Each hue has the following object created:

```js
{
  voilet: {
    isDark: true,
    hex: '#663399',
    rgb: '101.99999999999996 50.999999999999986 153.00000000000003',
    complemented: {
      isDark: true,
      hex: '#669933',
      rgb: '102.00000000000003 153.00000000000003 50.999999999999986'
    },
    variants: [
      {
        isDark: false,
        hex: '#F9F5FC',
        rgb: '248.625 245.4375 251.81249999999997',
        complemented: {
          isDark: false,
          hex: '#F9FCF5',
          rgb: '248.625 251.81249999999997 245.4375'
        }
      },
      // ... repeated for the remaining light/dark variants
    ],
  },
  // ... repeated for the remaining hues
}
```