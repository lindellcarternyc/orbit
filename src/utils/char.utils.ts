const isLetter =  (chr: string) => {
  return /^[a-zA-Z]$/.test(chr)
}

const isIdChar = (char: string) => {
  return isLetter(char) || char === '_'
}

const isPunc = (char: string) => {
  return /^\(|\)|\{|\}|\[|\]|:|\|$/.test(char)
}

const isDigit = (char: string) => {
  return /^[0-9]$/.test(char)
}

const isWhitespace = (char: string) => {
  return /^[^\S\r\n]$/.test(char)
}

const isNewline = (char: string) => {
  return /^[\r\n]$/.test(char)
}

const isOperator = (char: string) => {
  return ['+', '-', '/', '*', '=', '.'].includes(char.charAt(0))
}

const CharUtils = Object.freeze({
  isLetter,
  isIdChar,
  isPunc,
  isDigit,
  isWhitespace,
  isNewline,
  isOperator
})

export default CharUtils