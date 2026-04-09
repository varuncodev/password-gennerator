import { useState, useCallback, useEffect, useRef } from 'react'

function App() {
  const [length, setLength] = useState(8)
  const [numAllowed, setNumAllowed] = useState(false)
  const [charAllowed, setCharAllowed] = useState(false)
  const [password, setPassword] = useState("")

  const passRef = useRef(null)

  const passwordGenerator = useCallback(() => {
    let pass = ""
    let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"

    if (numAllowed) str += "0123456789"
    if (charAllowed) str += "!@#$%^&*(){}[]~"

    for (let i = 0; i < length; i++) {
      let char = Math.floor(Math.random() * str.length)
      pass += str.charAt(char)
    }

    setPassword(pass)
  }, [length, numAllowed, charAllowed])

  const copyPasswordtoClipboard = useCallback(() => {
    passRef.current?.select()
    passRef.current?.setSelectionRange(0, 999) // mobile support
    window.navigator.clipboard.writeText(password)
    alert("Copied to clipboard!")
  }, [password])

  useEffect(() => {
    passwordGenerator()
  }, [length, numAllowed, charAllowed, passwordGenerator])

  return (
    <div className='w-full max-w-md mx-auto shadow-md rounded-lg px-4 py-3 my-8 bg-yellow-800'>
      <h1 className='text-white text-center my-3'>
        Password Generator
      </h1>

      <div className='flex shadow rounded-lg overflow-hidden mb-4'>
        <input
          type='text'
          value={password}
          className='outline-none w-full py-1 px-3'
          placeholder='Password'
          readOnly
          ref={passRef}
        />
        <button
          onClick={copyPasswordtoClipboard}
          className='outline-none bg-blue-700 text-white px-3 py-0.5 shrink-0'>
          Copy
        </button>
      </div>

      <div className='flex flex-col text-sm gap-y-3'>
        
        {/* Length Slider */}
        <div className='flex items-center gap-x-2'>
          <input
            type='range'
            min={6}
            max={100}
            value={length}
            className='cursor-pointer'
            onChange={(e) => setLength(Number(e.target.value))}
          />
          <label className='text-white'>Length: {length}</label>
        </div>

        {/* Numbers */}
        <div className='flex items-center gap-x-2'>
          <input
            type='checkbox'
            checked={numAllowed}
            id="numberInput"
            onChange={() => setNumAllowed(prev => !prev)}
          />
          <label htmlFor="numberInput" className='text-white'>
            Include Numbers
          </label>
        </div>

        {/* Characters */}
        <div className='flex items-center gap-x-2'>
          <input
            type='checkbox'
            checked={charAllowed}
            id="characterInput"
            onChange={() => setCharAllowed(prev => !prev)}
          />
          <label htmlFor="characterInput" className='text-white'>
            Include Special Characters
          </label>
        </div>

      </div>
    </div>
  )
}

export default App