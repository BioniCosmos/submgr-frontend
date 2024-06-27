import ky from 'ky'

export default ky.create({
  prefixUrl: import.meta.env.VITE_SERVER_BASE_URL ?? '/',
  parseJson: (text) =>
    JSON.parse(text, (key, value) => {
      if (key.endsWith('Date')) {
        return Temporal.ZonedDateTime.from(value)
      }
      if (key === 'expire') {
        return Temporal.Instant.from(value)
      }
      return value
    }),
})
