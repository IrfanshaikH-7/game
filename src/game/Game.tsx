import Dice from '../components/shared/Dice'
import IsometricBoard from './IsometricBoard'

export default function Game() {
  return (
    <div style={{ position: 'relative', height: '100vh' }}>
      <IsometricBoard />
      <Dice />
    </div>
  )
}
