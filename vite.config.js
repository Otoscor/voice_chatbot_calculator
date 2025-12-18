import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // GitHub Pages 배포 시 저장소 이름으로 변경하세요
  // 예: '/voice-chatbot-cost/' 또는 '/' (username.github.io 사용 시)
  base: '/voice_chatbot_cost/',
})

