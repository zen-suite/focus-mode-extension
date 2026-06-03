export interface IArithmeticProblem {
  expression: string
  answer: number
}

type Token =
  | { type: 'number'; value: number }
  | { type: 'operator'; value: '+' | '-' | '*' | '/' }
  | { type: 'paren'; value: '(' | ')' }

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function tokenize(expression: string): Token[] {
  const tokens: Token[] = []
  let index = 0

  while (index < expression.length) {
    const char = expression[index]
    if (char === ' ') {
      index += 1
      continue
    }
    if (char >= '0' && char <= '9') {
      let digits = char
      index += 1
      while (
        index < expression.length &&
        expression[index] >= '0' &&
        expression[index] <= '9'
      ) {
        digits += expression[index]
        index += 1
      }
      tokens.push({ type: 'number', value: Number.parseInt(digits, 10) })
      continue
    }
    if (char === '+' || char === '-' || char === '*' || char === '/') {
      tokens.push({ type: 'operator', value: char })
      index += 1
      continue
    }
    if (char === '(' || char === ')') {
      tokens.push({ type: 'paren', value: char })
      index += 1
      continue
    }
    throw new Error(`Unexpected character: ${char}`)
  }

  return tokens
}

export function evaluateExpression(expression: string): number {
  const tokens = tokenize(expression)
  let position = 0

  function peek(): Token | undefined {
    return tokens[position]
  }

  function consume(): Token {
    const token = tokens[position]
    if (!token) {
      throw new Error('Unexpected end of expression')
    }
    position += 1
    return token
  }

  function parseExpression(): number {
    let value = parseTerm()

    while (
      peek()?.type === 'operator' &&
      (peek() as Token).value !== '*' &&
      (peek() as Token).value !== '/'
    ) {
      const operator = (consume() as { type: 'operator'; value: '+' | '-' })
        .value
      const right = parseTerm()
      value = operator === '+' ? value + right : value - right
    }

    return value
  }

  function parseTerm(): number {
    let value = parseFactor()

    while (
      peek()?.type === 'operator' &&
      ((peek() as Token).value === '*' || (peek() as Token).value === '/')
    ) {
      const operator = (consume() as { type: 'operator'; value: '*' | '/' })
        .value
      const right = parseFactor()
      if (operator === '/') {
        if (right === 0 || value % right !== 0) {
          throw new Error('Invalid division')
        }
        value = value / right
      } else {
        value = value * right
      }
    }

    return value
  }

  function parseFactor(): number {
    const token = peek()
    if (token?.type === 'paren' && token.value === '(') {
      consume()
      const value = parseExpression()
      const closing = consume()
      if (closing.type !== 'paren' || closing.value !== ')') {
        throw new Error('Expected closing parenthesis')
      }
      return value
    }
    if (token?.type === 'number') {
      return (consume() as { type: 'number'; value: number }).value
    }
    throw new Error('Expected number or parenthesis')
  }

  const result = parseExpression()
  if (position < tokens.length) {
    throw new Error('Unexpected tokens after expression')
  }
  return result
}

function expressionUsesRequiredOperators(expression: string): boolean {
  return (
    expression.includes('+') &&
    expression.includes('-') &&
    expression.includes('*') &&
    expression.includes('/') &&
    expression.includes('(') &&
    expression.includes(')')
  )
}

export function generateArithmeticProblem(): IArithmeticProblem {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    const a = randomInt(2, 9)
    const b = randomInt(2, 9)
    const c = randomInt(2, 5)
    const sum = a + b
    const product = sum * c
    const divisors = [2, 3, 4, 5, 6, 7, 8].filter(
      (divisor) => product % divisor === 0 && divisor < product
    )
    if (divisors.length === 0) {
      continue
    }
    const divisor = divisors[randomInt(0, divisors.length - 1)]
    const afterDivision = product / divisor
    const subtract = randomInt(1, Math.min(5, afterDivision))
    const expression = `(${a} + ${b}) * ${c} / ${divisor} - ${subtract}`

    if (!expressionUsesRequiredOperators(expression)) {
      continue
    }

    const answer = evaluateExpression(expression)
    if (Number.isInteger(answer) && answer >= 0) {
      return { expression, answer }
    }
  }

  const fallback = '(6 + 2) * 3 / 4 - 1'
  return { expression: fallback, answer: evaluateExpression(fallback) }
}

export function isAnswerCorrect(
  problem: IArithmeticProblem,
  userInput: string
): boolean {
  const trimmed = userInput.trim()
  if (!/^-?\d+$/.test(trimmed)) {
    return false
  }
  const parsed = Number.parseInt(trimmed, 10)
  return parsed === problem.answer
}
