/**
 * AI 음성 챗봇 파이프라인 가격 데이터
 * STT, LLM, TTS 서비스별 가격 정보 및 프리셋 구성
 * 
 * 가격 출처:
 * - 공식 API 문서 및 가격 페이지 (2024-2025)
 * - 가격은 변동될 수 있으므로 공식 사이트에서 확인 권장
 */

export const PRICING_DATA = {
  stt: [
    { 
      id: 'deepgram-nova', 
      name: 'Deepgram Nova-2', 
      costPerMin: 0.0043, 
      provider: 'Deepgram', 
      desc: '최저가, 빠른 속도' 
    },
    { 
      id: 'openai-whisper', 
      name: 'OpenAI Whisper', 
      costPerMin: 0.006, 
      provider: 'OpenAI', 
      desc: '높은 정확도' 
    },
    { 
      id: 'assemblyai', 
      name: 'AssemblyAI', 
      costPerMin: 0.015, 
      provider: 'AssemblyAI', 
      desc: '화자 분리, 요약' 
    },
    { 
      id: 'azure-speech', 
      name: 'Azure Speech to Text', 
      costPerMin: 0.016, 
      provider: 'Microsoft', 
      desc: '실시간 처리' 
    },
    { 
      id: 'rev-ai', 
      name: 'Rev.ai', 
      costPerMin: 0.020, 
      provider: 'Rev.ai', 
      desc: '높은 정확도' 
    },
    { 
      id: 'google-stt', 
      name: 'Google Cloud STT', 
      costPerMin: 0.024, 
      provider: 'Google', 
      desc: '다국어 지원 우수' 
    },
    { 
      id: 'amazon-transcribe', 
      name: 'Amazon Transcribe', 
      costPerMin: 0.024, 
      provider: 'Amazon', 
      desc: 'AWS 통합' 
    },
  ],
  llm: [
    { 
      id: 'gemini-1-5-flash', 
      name: 'Gemini 1.5 Flash', 
      costInput: 0.075, 
      costOutput: 0.30, 
      provider: 'Google', 
      desc: '초저가 옵션' 
    },
    { 
      id: 'gpt-4o-mini', 
      name: 'GPT-4o-mini', 
      costInput: 0.15, 
      costOutput: 0.60, 
      provider: 'OpenAI', 
      desc: '가성비 우수' 
    },
    { 
      id: 'claude-3-5-haiku', 
      name: 'Claude 3.5 Haiku', 
      costInput: 0.80, 
      costOutput: 4.00, 
      provider: 'Anthropic', 
      desc: '빠른 응답' 
    },
    { 
      id: 'gemini-2-5-pro', 
      name: 'Gemini 2.5 Pro', 
      costInput: 1.25, 
      costOutput: 10.00, 
      provider: 'Google', 
      desc: '복잡한 추론 능력' 
    },
    { 
      id: 'gpt-4o', 
      name: 'GPT-4o', 
      costInput: 2.50, 
      costOutput: 10.00, 
      provider: 'OpenAI', 
      desc: '멀티모달 지원' 
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
      id: 'gpt-4-turbo', 
      name: 'GPT-4 Turbo', 
      costInput: 10.00, 
      costOutput: 30.00, 
      provider: 'OpenAI', 
      desc: '최고 성능' 
    },
    { 
      id: 'claude-3-opus', 
      name: 'Claude 3 Opus', 
      costInput: 15.00, 
      costOutput: 75.00, 
      provider: 'Anthropic', 
      desc: '최고 지능' 
    },
  ],
  tts: [
    { 
      id: 'amazon-polly-standard', 
      name: 'Amazon Polly Standard', 
      costPer1MChar: 4.0, 
      provider: 'Amazon', 
      desc: '저렴한 기본 품질' 
    },
    { 
      id: 'openai-tts', 
      name: 'OpenAI TTS', 
      costPer1MChar: 15.0, 
      provider: 'OpenAI', 
      desc: '자연스러운 억양' 
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
    { 
      id: 'amazon-polly-neural', 
      name: 'Amazon Polly Neural', 
      costPer1MChar: 16.0, 
      provider: 'Amazon', 
      desc: '뉴럴 고품질' 
    },
    { 
      id: 'openai-tts-hd', 
      name: 'OpenAI TTS HD', 
      costPer1MChar: 30.0, 
      provider: 'OpenAI', 
      desc: '최고 음질' 
    },
    { 
      id: 'playht', 
      name: 'PlayHT', 
      costPer1MChar: 48.0, 
      provider: 'PlayHT', 
      desc: '실시간 스트리밍' 
    },
    { 
      id: 'elevenlabs-turbo', 
      name: 'ElevenLabs Turbo v2', 
      costPer1MChar: 180.0, 
      provider: 'ElevenLabs', 
      desc: '최고 감정 표현' 
    },
  ]
};

export const PRESETS = {
  ultra: {
    name: '울트라 프리미엄',
    stt: 'google-stt',
    llm: 'claude-3-opus',
    tts: 'elevenlabs-turbo',
    desc: '최고급 사용자 경험'
  },
  premium: {
    name: '프리미엄',
    stt: 'openai-whisper',
    llm: 'gpt-4o',
    tts: 'openai-tts-hd',
    desc: '고품질 서비스'
  },
  balanced: {
    name: '밸런스',
    stt: 'openai-whisper',
    llm: 'gemini-2-5-pro',
    tts: 'openai-tts',
    desc: '성능과 가격의 조화'
  },
  efficient: {
    name: '효율형',
    stt: 'deepgram-nova',
    llm: 'claude-3-5-haiku',
    tts: 'google-wavenet',
    desc: '빠르고 저렴한 응답'
  },
  budget: {
    name: '초저가',
    stt: 'deepgram-nova',
    llm: 'gemini-1-5-flash',
    tts: 'amazon-polly-standard',
    desc: '최소 비용 운영'
  }
};

// 기본 선택 모델 인덱스
export const DEFAULT_SELECTIONS = {
  stt: 1,      // OpenAI Whisper
  llm: 1,      // GPT-4o-mini
  tts: 1       // OpenAI TTS
};

// 계산 상수
export const CALCULATION_CONSTANTS = {
  DAYS_IN_MONTH: 30,
  CHARS_PER_TOKEN: 3
};

