import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'

import App from './App.jsx'

import './css/style.css'

function Root() {
  const [needRefresh, setNeedRefresh] = useState(false)
  const [updateServiceWorker, setUpdateServiceWorker] = useState(() => () => {})

  useEffect(() => {
    const updateSW = registerSW({
      onNeedRefresh() {
        setNeedRefresh(true)
      },
      onOfflineReady() {
        console.log('PWA: Готово працювати офлайн')
      },
    })
    setUpdateServiceWorker(() => updateSW)
  }, [])

  return (
    <>
      <App />
      {needRefresh && (
        <div style={{ position: 'fixed', bottom: 20, right: 20, background: '#222', color: '#fff', padding: '10px 20px', borderRadius: 8 }}>
          <p>Доступне оновлення!</p>
          <button
            onClick={() => {
              updateServiceWorker(true)
              window.location.reload()
            }}
            style={{ marginLeft: 10, padding: '5px 10px' }}
          >
            Оновити
          </button>
        </div>
      )}
    </>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)



// import { StrictMode } from 'react'
//import { createRoot } from 'react-dom/client'

//import App from './App.jsx'

//import './css/style.css'

//createRoot(document.getElementById('root')).render(
//  <StrictMode>
//    <App />
//  </StrictMode>,
//)
