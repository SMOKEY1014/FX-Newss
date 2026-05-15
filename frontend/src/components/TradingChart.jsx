import { AdvancedRealTimeChart } from 'react-ts-tradingview-widgets'

export default function TradingChart({ symbol }) {
  return (
    <div className="chart">
      <AdvancedRealTimeChart
        theme="dark"
        symbol={symbol}
        autosize
      />
    </div>
  )
}
