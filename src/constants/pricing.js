/**
 * AI 음성 챗봇 파이프라인 가격 데이터
 * STT, LLM, TTS 서비스별 가격 정보 및 프리셋 구성
 */

export const PRICING_DATA = {
  stt: [
    { 
      id: 'openai-whisper', 
      name: 'OpenAI Whisper', 
      costPerMin: 0.006, 
      provider: 'OpenAI', 
      desc: '표준적인 높은 정확도' 
    },
    { 
      id: 'google-stt', 
      name: 'Google Cloud STT', 
      costPerMin: 0.024, 
      provider: 'Google', 
      desc: '다국어 지원 우수' 
    },
    { 
      id: 'deepgram-nova', 
      name: 'Deepgram Nova-2', 
      costPerMin: 0.0043, 
      provider: 'Deepgram', 
      desc: '빠른 속도, 가성비' 
    },
    { 
      id: 'azure-speech', 
      name: 'Azure Speech to Text', 
      costPerMin: 0.016, 
      provider: 'Microsoft', 
      desc: '실시간 처리 안정성' 
    },
  ],
  llm: [
    { 
      id: 'gpt-4o', 
      name: 'GPT-4o', 
      costInput: 2.50, 
      costOutput: 10.00, 
      provider: 'OpenAI', 
      desc: '최신 플래그십' 
    },
    { 
      id: 'gpt-4o-mini', 
      name: 'GPT-4o-mini', 
      costInput: 0.15, 
      costOutput: 0.60, 
      provider: 'OpenAI', 
      desc: 'GPT-3.5 대체 가성비' 
    },
    { 
      id: 'claude-3-5-sonnet', 
      name: 'Claude 3.5 Sonnet', 
      costInput: 3.00, 
      costOutput: 15.00, 
      provider: 'Anthropic', 
      desc: '자연스러운 대화' 
    },
    { 
      id: 'gemini-1-5-flash', 
      name: 'Gemini 1.5 Flash', 
      costInput: 0.075, 
      costOutput: 0.30, 
      provider: 'Google', 
      desc: '최저가 옵션' 
    },
  ],
  tts: [
    { 
      id: 'openai-tts', 
      name: 'OpenAI TTS', 
      costPer1MChar: 15.0, 
      provider: 'OpenAI', 
      desc: '자연스러운 억양' 
    },
    { 
      id: 'elevenlabs-turbo', 
      name: 'ElevenLabs Turbo v2', 
      costPer1MChar: 180.0, 
      provider: 'ElevenLabs', 
      desc: '최고의 감정 표현' 
    },
    { 
      id: 'google-wavenet', 
      name: 'Google TTS (WaveNet)', 
      costPer1MChar: 16.0, 
      provider: 'Google', 
      desc: '안정적인 품질' 
    },
    { 
      id: 'azure-neural', 
      name: 'Azure Neural TTS', 
      costPer1MChar: 16.0, 
      provider: 'Microsoft', 
      desc: '다양한 한국어 보이스' 
    },
  ]
};

export const PRESETS = {
  premium: {
    name: '최고 성능',
    stt: 'openai-whisper',
    llm: 'gpt-4o',
    tts: 'elevenlabs-turbo',
    desc: '최고의 사용자 경험'
  },
  balanced: {
    name: '밸런스',
    stt: 'openai-whisper',
    llm: 'gpt-4o-mini',
    tts: 'openai-tts',
    desc: '성능과 가격의 조화'
  },
  budget: {
    name: '초저가',
    stt: 'deepgram-nova',
    llm: 'gemini-1-5-flash',
    tts: 'google-wavenet',
    desc: '최소 비용 운영'
  }
};

// 기본 선택 모델 인덱스
export const DEFAULT_SELECTIONS = {
  stt: 0,      // OpenAI Whisper
  llm: 1,      // GPT-4o-mini
  tts: 0       // OpenAI TTS
};

// 계산 상수
export const CALCULATION_CONSTANTS = {
  DAYS_IN_MONTH: 30,
  CHARS_PER_TOKEN: 3
};

