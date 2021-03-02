import Color from 'color'

const names = [
  'red',
  'orange',
  'yellow',
  'lime',
  'green',
  'teal',
  'cyan',
  'blue',
  'indigo',
  'violet',
  'fuschia',
  'pink',
]

const hues = (base: number) => names.map((_, index) => base + (index * (360 / names.length)) % 360)
const lightnessLevels = Array.from(Array(40), (_, index) => ((index + 0.5) * 5) / 2).reverse()

const colorObject = (color: Color) => ({
  isDark: color.isDark(),
  hex: color.hex(),
  rgb: color.rgb().array().join(' '),
})

const createVariations = (color: Color) => lightnessLevels.map(level => colorObject(color.lightness(level)))

const cyanea = (hex: string) => {
  const color = Color(hex)
  const [h, s, l] = color.hsl().array()
  const grayVariant = Color.hsl(h, (s / 10), l)
  
  const adjustments = {
    gray: {
      ...colorObject(grayVariant),
      variants: createVariations(grayVariant),
    },
    ...s > 0 && {
      desaturated: {
        ...colorObject(Color.hsl(h, (s / 3), l)),
        variants: createVariations(Color.hsl(h, (s / 3), l)),
      },
    },
    ...s < 100 && {
      saturated: {
        ...colorObject(Color.hsl(h, (s + 25), l)),
        variants: createVariations(Color.hsl(h, (s + 25), l)),
      },
    },
  }

  const reduced = hues(h).reduce((acc, hue) => {
    const adjustedColor = Color.hsl(hue, s, l)
    const [ h ] = adjustedColor.hsl().array()
    return {
      ...acc,
      [names[Math.round(h / 30)] || 'red']: {
        ...colorObject(adjustedColor),
        variants: createVariations(adjustedColor),
      },
    }
  }, {})

  return {
    ...reduced,
    ...adjustments,
  }
}

export default cyanea
