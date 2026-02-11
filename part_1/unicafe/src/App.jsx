import { useState } from 'react'

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>

const StatisticLine = ({ text, value }) => (
  <tr>
    <td>{text}</td>
    <td>{value}</td>
  </tr>
)

const Statistics = ({ stats }) => {
  if (stats.all === 0) {
    return <p>No feedback given</p>
  }

  return (
    <table>
      <tbody>
        <StatisticLine text="good" value={stats.good} />
        <StatisticLine text="neutral" value={stats.neutral} />
        <StatisticLine text="bad" value={stats.bad} />
        <StatisticLine text="all" value={stats.all} />
        <StatisticLine text="average" value={stats.average.toFixed(1)} />
        <StatisticLine text="positive" value={`${stats.positive.toFixed(1)} %`} />
      </tbody>
    </table>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const all = good + neutral + bad
  const average = all === 0 ? 0 : (good - bad) / all
  const positive = all === 0 ? 0 : (good / all) * 100

  const handleGood = () => setGood((prev) => prev + 1)
  const handleNeutral = () => setNeutral((prev) => prev + 1)
  const handleBad = () => setBad((prev) => prev + 1)

  const stats = {
    good,
    neutral,
    bad,
    all,
    average,
    positive,
  }
  return (
    <>
      <h2>Give Feedback</h2>
      <div>
        <Button onClick={handleGood} text="Good" />
        <Button onClick={handleNeutral} text="Neutral" />
        <Button onClick={handleBad} text="Bad" />
      </div>
      <h2>Statistics</h2>
      <Statistics stats={stats} />
    </>
  )
}

export default App
