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
  'red',
]

const hues = names.map((_, index) => (index * (360 / names.length)) % 360)
const lightnessLevels = Array.from(Array(20), (_, index) => ((index + 0.5) * 10) / 2).reverse()


const initializeColor = color => ({
  isDark: color.isDark(),
  hex: color.hex(),
  rgb: color.rgb().color.join(' '),
})

const colorObject = color => ({
  ...initializeColor(color),
  complemented: initializeColor(color.rotate(180)),
})

const createVariations = color => lightnessLevels.map(level => {
  return colorObject(color.lightness(level))
})

const cyanea = hex => {
  const color = Color(hex)
  const [h, s, l] = color.hsl().color
  const grayVariant = Color.hsl(h, (s / 8), l)
  
  const builtColors = {
    gray: {
      ...colorObject(grayVariant),
      variants: createVariations(grayVariant),
    }
  }

  hues.forEach(hue => {
    const adjustedColor = color.rotate(hue)
    const [ h ] = adjustedColor.hsl().color
    builtColors[names[Math.round((h / 30))]] = {
      ...colorObject(adjustedColor),
      variants: createVariations(adjustedColor),
    }
  })

  return builtColors
}

export default cyanea
