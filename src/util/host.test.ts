import { isValidHttpDomain, normalizeHttpUrl } from './host'

describe(isValidHttpDomain, () => {
  it.each([
    {
      input: 'hello-world',
      expected: false,
    },
    { input: 'hello-world.com', expected: true },
    { input: 'http://hello.org', expected: true },
    { input: 'https://hello.com', expected: true },
  ])('given $input, return should be $expected', ({ input, expected }) => {
    expect(isValidHttpDomain(input)).toBe(expected)
  })
})

describe(normalizeHttpUrl, () => {
  it.each([
    {
      input: 'hello.com',
      expected: 'http://hello.com',
    },
    {
      input: 'https://example.com',
      expected: 'https://example.com',
    },
  ])('given $input, return should be $expected', ({ input, expected }) => {
    expect(normalizeHttpUrl(input)).toBe(expected)
  })
})
