/**
 * AI 캐릭터 챗봇 파이프라인 가격 데이터
 * 캐릭터 아바타 AI 챗에서 실제 사용되는 핵심 API만 선별
 * 
 * 가격 출처:
 * - 공식 API 문서 및 가격 페이지 (2026년 1월 기준)
 * - 가격은 변동될 수 있으므로 공식 사이트에서 확인 권장
 * - 환율: 1 USD = 1,430 KRW 기준
 */

export const PRICING_DATA = {
  stt: [
    // 없음 옵션
    {
      id: 'none',
      name: '없음 (텍스트 입력)',
      costPerMin: 0,
      provider: '-',
      desc: 'STT 미사용',
      officialSite: ''
    },
    // 글로벌 - 캐릭터 챗에서 가장 많이 사용
    {
      id: 'deepgram-nova',
      name: 'Deepgram Nova-2',
      costPerMin: 0.0043,
      provider: 'Deepgram',
      desc: '초저지연, 실시간 스트리밍',
      officialSite: 'https://deepgram.com/pricing'
    },
    {
      id: 'openai-whisper',
      name: 'OpenAI Whisper',
      costPerMin: 0.006,
      provider: 'OpenAI',
      desc: '높은 정확도, 다국어',
      officialSite: 'https://openai.com/api/pricing'
    },
    // 한국 - 한국어 캐릭터 챗 필수
    {
      id: 'vito-stt',
      name: 'VITO STT (ReturnZero)',
      costPerMin: 0.012,
      provider: 'ReturnZero',
      desc: '한국어 인식률 우수',
      officialSite: 'https://developers.rtzr.ai/'
    },
    {
      id: 'naver-clova-speech',
      name: 'Naver Clova Speech',
      costPerMin: 0.014, // 5원/15초 = 20원/분 ÷ 1430 = $0.014
      provider: 'Naver Cloud',
      desc: '한국어 인식 최적화',
      officialSite: 'https://www.ncloud.com/product/aiService/clovaSpeech'
    },
  ],
  llm: [
    // 글로벌 - 캐릭터 대화에 최적화된 모델
    {
      id: 'gpt-4o-mini',
      name: 'GPT-4o-mini',
      costInput: 0.15,
      costOutput: 0.60,
      provider: 'OpenAI',
      desc: '캐릭터 챗 가성비 1위',
      officialSite: 'https://openai.com/api/pricing'
    },
    {
      id: 'gemini-1-5-flash',
      name: 'Gemini 1.5 Flash',
      costInput: 0.075,
      costOutput: 0.30,
      provider: 'Google',
      desc: '최강 가성비, 빠른 응답',
      officialSite: 'https://ai.google.dev/pricing'
    },
    {
      id: 'claude-3-5-sonnet',
      name: 'Claude 3.5 Sonnet',
      costInput: 3.00,
      costOutput: 15.00,
      provider: 'Anthropic',
      desc: '자연스러운 페르소나 구현',
      officialSite: 'https://www.anthropic.com/pricing'
    },
    {
      id: 'gpt-4o',
      name: 'GPT-4o',
      costInput: 2.50,
      costOutput: 10.00,
      provider: 'OpenAI',
      desc: '프리미엄 캐릭터 경험',
      officialSite: 'https://openai.com/api/pricing'
    },
    // 한국 - 한국어 캐릭터 대화
    {
      id: 'hyperclova-x',
      name: 'HyperCLOVA X',
      costInput: 3.00,
      costOutput: 12.00,
      provider: 'Naver',
      desc: '한국어 캐릭터 대화 최강',
      officialSite: 'https://clova.ai/hyperclova',
      isEstimate: true
    },
    {
      id: 'upstage-solar-pro',
      name: 'Upstage Solar Pro 2',
      costInput: 0.10, // 공식 Solar Pro 2 가격
      costOutput: 0.10,
      provider: 'Upstage',
      desc: '한국어/영어 가성비 최고',
      officialSite: 'https://www.upstage.ai/solar-llm'
    },
  ],
  tts: [
    // 글로벌 - 캐릭터 음성 표현력 중심
    {
      id: 'elevenlabs-turbo',
      name: 'ElevenLabs Turbo v2',
      costPer1MChar: 90.0,
      provider: 'ElevenLabs',
      desc: '최고 감정 표현, 캐릭터 보이스',
      officialSite: 'https://elevenlabs.io/pricing'
    },
    {
      id: 'openai-tts',
      name: 'OpenAI TTS',
      costPer1MChar: 15.0,
      provider: 'OpenAI',
      desc: '자연스러운 억양, 가성비',
      officialSite: 'https://platform.openai.com/docs/guides/text-to-speech'
    },
    {
      id: 'openai-tts-hd',
      name: 'OpenAI TTS HD',
      costPer1MChar: 30.0,
      provider: 'OpenAI',
      desc: '고음질 캐릭터 보이스',
      officialSite: 'https://platform.openai.com/docs/guides/text-to-speech'
    },
    // 한국 - 한국어 음성
    {
      id: 'naver-clova-voice',
      name: 'Naver Clova Voice',
      costPer1MChar: 20.0,
      provider: 'Naver Cloud',
      desc: '자연스러운 한국어 발음',
      officialSite: 'https://www.ncloud.com/product/aiService/clovaVoice',
      isEstimate: true
    },
    {
      id: 'typecast',
      name: 'Typecast',
      costPer1MChar: 160.0, // Plus 플랜 초과요금 $0.08/1K credits, 2 credits/char 기준
      provider: 'Typecast',
      desc: '감정 표현, 한국어 캐릭터 보이스',
      officialSite: 'https://typecast.ai/pricing'
    },
  ]
};

export const PRESETS = {
  character_premium: {
    name: '캐릭터 프리미엄',
    stt: 'openai-whisper',
    llm: 'claude-3-5-sonnet',
    tts: 'elevenlabs-turbo',
    desc: '최고 품질 캐릭터 경험'
  },
  character_balanced: {
    name: '캐릭터 밸런스',
    stt: 'deepgram-nova',
    llm: 'gpt-4o-mini',
    tts: 'openai-tts',
    desc: '가성비 좋은 캐릭터 챗'
  },
  korean_character: {
    name: '한국어 캐릭터',
    stt: 'vito-stt',
    llm: 'hyperclova-x',
    tts: 'naver-clova-voice',
    desc: '한국어 캐릭터 최적화'
  },
  korean_lite: {
    name: '한국어 실속형',
    stt: 'vito-stt',
    llm: 'upstage-solar-pro',
    tts: 'openai-tts',
    desc: '가성비 한국어 조합'
  },
};

// 기본 선택 모델 인덱스
export const DEFAULT_SELECTIONS = {
  stt: 0,      // Deepgram Nova-2
  llm: 0,      // GPT-4o-mini
  tts: 1       // OpenAI TTS
};

// 계산 상수
export const CALCULATION_CONSTANTS = {
  DAYS_IN_MONTH: 30,
  CHARS_PER_TOKEN: 3
};

