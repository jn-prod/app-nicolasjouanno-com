// import { useState } from 'preact/hooks'
// import preactLogo from './assets/preact.svg'
// import viteLogo from '/vite.svg'
import './app.css'
import InputFile from './components/input-file'

export function App() {
  // const [count, setCount] = useState(0)
  // const handleInput = (event: InputEvent ) => {
  //   console.log(event)
  // }
  const handleUploadClick = () => {
    console.log('click')
  }
  return (
    <>
      <form>
        <InputFile></InputFile>
        <button onClick={handleUploadClick}> Upload to S3</button>
      </form>
    </>
  )
}
