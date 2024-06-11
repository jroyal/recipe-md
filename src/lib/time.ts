const iso8601DurationRegex =
  /(-)?P(?:([.,\d]+)Y)?(?:([.,\d]+)M)?(?:([.,\d]+)W)?(?:([.,\d]+)D)?T(?:([.,\d]+)H)?(?:([.,\d]+)M)?(?:([.,\d]+)S)?/

function parseISO8601Duration(iso8601Duration: string) {
  if (!iso8601Duration) {
    return ''
  }
  var matches = iso8601Duration.match(iso8601DurationRegex)
  if (!matches) {
    return iso8601Duration
  }

  const timeParts = {
    // sign: matches[1] === undefined ? '+' : '-',
    years: matches[2] === undefined ? 0 : matches[2],
    months: matches[3] === undefined ? 0 : matches[3],
    weeks: matches[4] === undefined ? 0 : matches[4],
    days: matches[5] === undefined ? 0 : matches[5],
    hours: matches[6] === undefined ? 0 : matches[6],
    minutes: matches[7] === undefined ? 0 : matches[7],
    seconds: matches[8] === undefined ? 0 : matches[8],
  }

  let formatted = ``
  for (const [key, value] of Object.entries(timeParts)) {
    if (value) {
      formatted = `${formatted} ${value} ${key}`
    }
  }
  return formatted
}

export { parseISO8601Duration }
