import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import styled from '@emotion/styled'
import cyanea from 'cyanea'
import ColorPackage from 'color'
import ReactGA from 'react-ga'
import { Global, css } from '@emotion/react'
import 'typeface-varela-round'

ReactGA.initialize('UA-160836815-1')

const Label = styled.h2`
  font-size: 1.2rem;
  text-transform: capitalize;
`

const ColorGroup = styled.div`
  display: grid;

  @media (min-width: 600px) {
    grid-template-columns: max-content auto;
  }
`

const ColorVariations = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
`

const Color = styled.div`
  color: ${({ isDark }) => isDark ? '#fff' : '#000'};
  background-color: ${({ hex }) => hex};
  padding: 1em;
  font-size: 0.8rem;

  &:hover {
    color: ${({ complemented }) => complemented && complemented.isDark ? '#fff' : '#000'};
    background-color: ${({ complemented }) => complemented && complemented.hex};
  }
`

const ColorBase = styled(Color)`
  padding: 3rem;
`

const FieldGroup = styled.div`
  display: flex;
  align-items: stretch;
`

const Input = styled.input`
  all: unset;
  background-color: white;
  border-top-left-radius: 0.2em;
  border-bottom-left-radius: 0.2em;
  width: 40%;
  padding: 0.5em;
  transition: all .2s ease-in-out;
`

const Button = styled.button`
  all: unset;
  border-top-right-radius: 0.2em;
  border-bottom-right-radius: 0.2em;
  padding: 0.5em 1em;
  white-space: nowrap;
  cursor: pointer;
  transition: all .2s ease-in-out;
`

const Failure = styled.div`
  color: ${({ color }) => color.isDark ? color.variants[0].hex : color.variants[17].hex};
  background-color: ${({ color }) => color.hex};
  margin: 2rem 0 0;
  padding: 0.5rem;
  border-radius: 0.2rem;
`

// Set colors on styled elements
const Container = styled.div`
  width: 90%;
  max-width: 900px;
  margin: 0 auto;
  font-family: 'Varela Round', sans-serif;

  ${Input} {
    border: 1px solid ${({ color }) => color.variants[1].hex};
    border-right: none;

    &:focus {
      border-color: ${({ color }) => color.hex};
    }
  }

  ${Button} {
    color: ${({ color }) => color.isDark ? color.variants[1].hex : color.variants[18].hex};
    background-color: ${({ color }) => color.hex};

    &:hover {
      background-color: ${({ color }) => color.variants[13].hex};
    }
  }
`

const Index = () => {

  const [color, setColor] = useState(cyanea('rebeccapurple'))
  const [failure, setFailure] = useState(null)

  const handleSubmit = event => {
    event.preventDefault()
    const { value } = event.target.elements.color

    ReactGA.event({
      category: 'Color',
      action: 'Changed the value',
      label: value,
    })

    try {
      const [h, s, l] = ColorPackage(value).hsl().color

      if (l > 96) {
        setFailure('Oops! This color is too light to work correctly. Try a different one.')
        return false
      }

      if (s < 5) {
        setFailure('Oops! This color doesn\'t have enough saturation to work correctly. Try a different one.')
        return false
      }

      setColor(cyanea(event.target.elements.color.value))
      setFailure(null)
    }
    catch (err) {
      setFailure('Oops! This doesn\'t look like a valid color. Did you forget the #?')
    }
  }

  const passedColor = color[Object.keys(color)[1]]

  return (
    <>
      <Global styles={css`
        html {
          color: ${passedColor.variants[17].hex};
          background-color: ${passedColor.variants[0].hex};
        }

        body {
          margin: 0;
          padding: 0 0 5vw;

          a {
            color: ${passedColor.hex};

            &:hover {
              color: ${passedColor.variants[10].hex};
            }
          }
        }
      `} />
      <Container color={passedColor}>
        <h1>cyanea</h1>
        <p>A full-spectrum color palette generator. View the source and usage information on <a href="https://github.com/loremipson/cyanea">github</a>.</p>
        <form onSubmit={e => handleSubmit(e)}>
          <label htmlFor="color">Pass a valid color to try it out</label>
          <FieldGroup>
            <Input id="color" type="text" name="color" placeholder="#663399" />
            <Button type="submit">Create Colors</Button>
          </FieldGroup>
        </form>
        {failure && <Failure color={color.red}>{failure}</Failure>}
        <div>
          {Object.keys(color).map(c => (
            <div key={color[c].hex}>
              <Label>{c}</Label>
              <ColorGroup>
                <ColorBase {...color[c]}>{color[c].hex}</ColorBase>
                <ColorVariations>
                  {color[c].variants.map(col => (
                    <Color key={col.hex} {...col}>{col.hex}</Color>
                  ))}
                </ColorVariations>
              </ColorGroup>
            </div>
          ))}
        </div>
      </Container>
    </>
  )
}

ReactDOM.render(<Index />, document.getElementById('root'))
