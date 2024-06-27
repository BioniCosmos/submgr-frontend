import _ky from 'ky'

const ky = _ky.create({
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

export default ky
export const fetcher = <T>(url: string) => ky(url, { retry: 0 }).json<T>()
