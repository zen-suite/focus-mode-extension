export class NotEnoughPermissionError extends Error {
  constructor(public readonly permission: string) {
    super(`Permission: "${permission}" is not granted`)
  }
}
