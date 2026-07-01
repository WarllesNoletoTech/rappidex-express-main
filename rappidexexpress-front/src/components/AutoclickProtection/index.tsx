import { useContext, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

import { DeliveryContext } from '../../context/DeliveryContext'
import api from '../../services/api'

const AUTOCLICK_REASON = 'Uso suspeito de autoclick'
const BLOCKED_MESSAGE = 'Seu acesso foi bloqueado por uso suspeito de autoclick. Procure o administrador.'
const TOLERANCE = 8
const MAX_CLICKS = 10
const CLICK_WINDOW_MS = 3000

type ClickPosition = {
  x: number
  y: number
  timestamp: number
}

export function AutoclickProtection() {
  const { token, permission, logout } = useContext(DeliveryContext)
  const navigate = useNavigate()
  const lastClickRef = useRef<ClickPosition | null>(null)
  const sameClickCountRef = useRef(0)
  const firstClickTimestampRef = useRef<number | null>(null)
  const blockingRef = useRef(false)

  useEffect(() => {
    if (permission !== 'motoboy' || !token) {
      lastClickRef.current = null
      sameClickCountRef.current = 0
      firstClickTimestampRef.current = null
      blockingRef.current = false
      return
    }

    async function handleClick(event: MouseEvent) {
      if (blockingRef.current) return

      const currentClick = {
        x: event.clientX,
        y: event.clientY,
        timestamp: Date.now(),
      }
      const lastClick = lastClickRef.current
      const isSamePosition = lastClick &&
        Math.abs(currentClick.x - lastClick.x) <= TOLERANCE &&
        Math.abs(currentClick.y - lastClick.y) <= TOLERANCE
      const firstClickTimestamp = firstClickTimestampRef.current
      const isWithinClickWindow = firstClickTimestamp !== null &&
        currentClick.timestamp - firstClickTimestamp <= CLICK_WINDOW_MS

      if (isSamePosition && isWithinClickWindow) {
        sameClickCountRef.current += 1
      } else {
        sameClickCountRef.current = 1
        firstClickTimestampRef.current = currentClick.timestamp
      }

      lastClickRef.current = currentClick

      if (sameClickCountRef.current < MAX_CLICKS) return

      blockingRef.current = true

      try {
        api.defaults.headers.Authorization = `Bearer ${token}`
        await api.post('/security/autoclick-detected', {
          reason: AUTOCLICK_REASON,
          clickCount: sameClickCountRef.current,
          position: currentClick,
        })
      } catch (error) {
        console.error(error)
      } finally {
        localStorage.clear()
        sessionStorage.clear()
        logout()
        alert(BLOCKED_MESSAGE)
        navigate('/login?blocked=autoclick', { replace: true })
      }
    }

    document.addEventListener('click', handleClick)

    return () => document.removeEventListener('click', handleClick)
  }, [logout, navigate, permission, token])

  return null
}
