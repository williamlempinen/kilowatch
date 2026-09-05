import { useState } from 'react'

function App() {
    const [count, setCount] = useState(0)

    return (
        <div>
            <main>
                <div>
                    <p>Hello world</p>
                    <p>{count}</p>
                    <button onClick={() => setCount((prev) => prev + 1)}>Increment</button>
                </div>
            </main>
        </div>
    )
}

export default App
