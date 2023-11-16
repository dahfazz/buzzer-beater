const cleanChars = (str) => {
  return str.replace('č', 'c').replace('ć', 'c')
}

module.exports = { cleanChars };