import { clearAllRules } from '../block-rules'

export default function Options(): JSX.Element {
  return (
    <div>
      <h1>Hello from Zen mode options (With HOt Reload)</h1>
      <button onClick={clearAllRules}>Clear all rules</button>
    </div>
  )
}
