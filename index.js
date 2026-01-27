import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Settings, DollarSign, Activity, Users, Volume2, Mic, Brain, Calculator, Info, Check, X, FileText, Play, Pause, RotateCcw, ArrowRight, Zap, Sparkles, MessageCircle, ChevronLeft, ChevronRight, Share2, ClipboardCheck } from 'lucide-react';

// --- 데이터 및 상수 정의 ---
const PRICING_DATA = {
  stt: [
    { id: 'openai-whisper', name: 'OpenAI Whisper', costPerMin: 0.006, provider: 'OpenAI', desc: '표준적인 높은 정확도' },
    { id: 'google-stt', name: 'Google Cloud STT', costPerMin: 0.024, provider: 'Google', desc: '다국어 지원 우수' },
    { id: 'deepgram-nova', name: 'Deepgram Nova-2', costPerMin: 0.0043, provider: 'Deepgram', desc: '빠른 속도, 가성비' },
    { id: 'azure-speech', name: 'Azure Speech to Text', costPerMin: 0.016, provider: 'Microsoft', desc: '실시간 처리 안정성' },
  ],
  llm: [
    { id: 'gpt-4o', name: 'GPT-4o', costInput: 2.50, costOutput: 10.00, provider: 'OpenAI', desc: '최신 플래그십' },
    { id: 'gpt-4o-mini', name: 'GPT-4o-mini', costInput: 0.15, costOutput: 0.60, provider: 'OpenAI', desc: 'GPT-3.5 대체 가성비' },
    { id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet', costInput: 3.00, costOutput: 15.00, provider: 'Anthropic', desc: '자연스러운 대화' },
    { id: 'gemini-1-5-flash', name: 'Gemini 1.5 Flash', costInput: 0.075, costOutput: 0.30, provider: 'Google', desc: '최저가 옵션' },
  ],
  tts: [
    { id: 'openai-tts', name: 'OpenAI TTS', costPer1MChar: 15.0, provider: 'OpenAI', desc: '자연스러운 억양' },
    { id: 'elevenlabs-turbo', name: 'ElevenLabs Turbo v2', costPer1MChar: 180.0, provider: 'ElevenLabs', desc: '최고의 감정 표현' },
    { id: 'google-wavenet', name: 'Google TTS (WaveNet)', costPer1MChar: 16.0, provider: 'Google', desc: '안정적인 품질' },
    { id: 'azure-neural', name: 'Azure Neural TTS', costPer1MChar: 16.0, provider: 'Microsoft', desc: '다양한 한국어 보이스' },
  ]
};

const PRESETS = {
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

// KRDS 스타일의 카드 컴포넌트
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg border border-gray-300 shadow-sm ${className}`}>
    {children}
  </div>
);

// --- 가격표 모달 (반응형 적용) ---
const PricingModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-200">
        <div className="p-4 md:p-5 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-lg md:text-xl font-bold text-gray-900 flex items-center gap-2">
            <DollarSign className="w-5 h-5 md:w-6 md:h-6 text-blue-700" />
            API 상세 가격표
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-md transition-colors text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4 md:p-6 space-y-6 md:space-y-8">
          {[
            { title: "Speech to Text", icon: Mic, data: PRICING_DATA.stt, costLabel: "가격 (분당)", costKey: "costPerMin" },
            { title: "LLM", icon: Brain, data: PRICING_DATA.llm, costLabel: "입력/출력 (1M 토큰)", costKey: "costInput" },
            { title: "Text to Speech", icon: Volume2, data: PRICING_DATA.tts, costLabel: "가격 (1M 글자당)", costKey: "costPer1MChar" }
          ].map((section, idx) => (
            <section key={idx}>
              <h3 className="text-base md:text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                <section.icon className="w-4 h-4 md:w-5 md:h-5 text-blue-700" /> {section.title}
              </h3>
              <div className="overflow-x-auto border-t-2 border-gray-800 rounded-sm">
                <table className="w-full text-xs md:text-sm text-left border-b border-gray-200 whitespace-nowrap md:whitespace-normal">
                  <thead className="bg-gray-50 text-gray-700 font-bold">
                    <tr>
                      <th className="p-2 md:p-3 border-b border-gray-200">모델명</th>
                      <th className="p-2 md:p-3 border-b border-gray-200">공급사</th>
                      <th className="p-2 md:p-3 border-b border-gray-200">{section.costLabel}</th>
                      <th className="p-2 md:p-3 border-b border-gray-200 hidden sm:table-cell">비고</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {section.data.map(item => (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-2 md:p-3 font-medium text-gray-900">{item.name}</td>
                        <td className="p-2 md:p-3 text-gray-600">{item.provider}</td>
                        <td className="p-2 md:p-3 text-blue-700 font-bold">
                          {section.costKey === "costInput" 
                            ? `In $${item.costInput} / Out $${item.costOutput}`
                            : `$${item[section.costKey]}`
                          }
                        </td>
                        <td className="p-2 md:p-3 text-gray-500 hidden sm:table-cell">{item.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ))}
          <div className="text-xs text-gray-500 mt-4 bg-gray-50 p-4 rounded border border-gray-200 leading-relaxed">
            * 모바일 환경에서는 일부 상세 정보가 생략될 수 있습니다.
          </div>
        </div>
      </div>
    </div>
  );
};

// --- 파이프라인 애니메이션 (반응형 적용) ---
const PipelineAnimation = () => {
  const [step, setStep] = useState(0); 
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let timer;
    if (isPlaying) {
      if (step < 5) {
        const delay = step === 0 ? 100 : step === 3 ? 2500 : 2000; 
        timer = setTimeout(() => {
          setStep(prev => prev + 1);
        }, delay);
      } else {
        timer = setTimeout(() => {
          setIsPlaying(false);
          setStep(0);
        }, 3000);
      }
    }
    return () => clearTimeout(timer);
  }, [isPlaying, step]);

  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      if (step >= 5) setStep(0);
      setIsPlaying(true);
    }
  };

  const nextStep = () => {
    setIsPlaying(false);
    setStep(prev => Math.min(5, prev + 1));
  };

  const prevStep = () => {
    setIsPlaying(false);
    setStep(prev => Math.max(0, prev - 1));
  };

  const steps = [
    { id: 1, label: "User", icon: Users, desc: "음성 입력" },
    { id: 2, label: "STT", icon: Mic, desc: "텍스트 변환" },
    { id: 3, label: "LLM", icon: Brain, desc: "답변 생성" },
    { id: 4, label: "TTS", icon: Volume2, desc: "음성 합성" },
  ];

  return (
    <div className="py-4 md:py-8 max-w-5xl mx-auto animate-in fade-in duration-500">
      
      {/* 컨트롤 패널 */}
      <div className="flex flex-col items-center mb-6 md:mb-10 gap-4">
        <div className="flex items-center gap-2 md:gap-3 bg-white p-1.5 md:p-2 rounded-lg shadow-sm border border-gray-300">
          <button 
            onClick={prevStep}
            disabled={step === 0}
            className="p-2 md:p-3 rounded hover:bg-gray-100 text-gray-600 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors border border-transparent hover:border-gray-200"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button 
            onClick={togglePlay} 
            className={`px-4 md:px-8 py-2 md:py-3 rounded font-bold text-sm md:text-lg flex items-center justify-center gap-2 transition-all min-w-[130px] md:min-w-[160px] ${
              isPlaying 
                ? 'bg-white text-blue-700 border border-blue-200 hover:bg-blue-50' 
                : 'bg-blue-700 text-white hover:bg-blue-800 shadow-sm'
            }`}
          >
            {isPlaying ? (
              <><Pause className="w-4 h-4 md:w-5 md:h-5 fill-current" /> <span className="hidden md:inline">일시 정지</span><span className="md:hidden">정지</span></>
            ) : (
              <><Play className="w-4 h-4 md:w-5 md:h-5 fill-current" /> {step === 0 || step === 5 ? <span className="md:hidden">재생</span> : <span className="md:hidden">계속</span>} <span className="hidden md:inline">{step === 0 || step === 5 ? "자동 재생" : "계속 재생"}</span></>
            )}
          </button>

          <button 
            onClick={nextStep}
            disabled={step === 5}
            className="p-2 md:p-3 rounded hover:bg-gray-100 text-gray-600 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors border border-transparent hover:border-gray-200"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        <p className="text-gray-500 text-xs md:text-sm font-medium">
          {isPlaying ? (
            <span className="flex items-center gap-1.5 text-blue-700">
              <RotateCcw className="w-3 md:w-3.5 h-3 md:h-3.5 animate-spin-slow" /> 시뮬레이션 중...
            </span>
          ) : "재생 버튼을 누르거나 화살표로 이동"}
        </p>
      </div>

      {/* 프로세스 다이어그램 */}
      <div className="relative mb-8 md:mb-12 px-2 md:px-12">
        {/* Progress Line */}
        <div className="absolute top-1/2 left-6 md:left-12 right-6 md:right-12 h-1.5 md:h-2 bg-gray-200 -z-10 rounded-full"></div>
        <div 
          className="absolute top-1/2 left-6 md:left-12 h-1.5 md:h-2 bg-blue-600 -z-10 transition-all duration-700 ease-in-out rounded-full"
          style={{ width: `calc(${Math.min((step / 4) * 100, 100)}% - 3rem)` }}
        ></div>

        <div className="grid grid-cols-4 gap-1 md:gap-4">
          {steps.map((s, idx) => {
            const isActive = step === s.id;
            const isPassed = step > s.id;
            
            return (
              <div key={s.id} className="flex flex-col items-center relative group cursor-pointer" onClick={() => { setIsPlaying(false); setStep(s.id); }}>
                <div 
                  className={`w-12 h-12 md:w-20 md:h-20 rounded-full flex items-center justify-center mb-2 md:mb-3 transition-all duration-300 border-2 z-10 bg-white
                    ${isActive || isPassed 
                      ? 'border-blue-600 text-blue-600 shadow-md scale-110' 
                      : 'border-gray-300 text-gray-400 group-hover:border-gray-400'
                    }
                  `}
                >
                  <s.icon className="w-5 h-5 md:w-8 md:h-8" />
                  {isActive && <div className="absolute inset-0 rounded-full animate-ping opacity-10 bg-blue-600"></div>}
                </div>
                <div className="text-center w-full">
                  <h3 className={`font-bold text-[10px] md:text-base leading-tight ${isActive ? 'text-blue-800' : 'text-gray-600'}`}>{s.label}</h3>
                  <p className="hidden md:block text-xs text-gray-500 mt-1">{s.desc}</p>
                </div>
                {/* 데이터 패킷 애니메이션 */}
                {isActive && idx < 3 && (
                   <div className="absolute top-[24px] md:top-[40px] -right-[50%] w-full flex justify-center items-center z-0">
                     <div className="w-2 h-2 md:w-3 md:h-3 bg-blue-500 rounded-full animate-[slideRight_1.5s_linear_infinite]"></div>
                   </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 대화 로그 UI */}
      <div className="max-w-xl mx-auto">
        <Card className="overflow-hidden border-gray-300">
          <div className="bg-gray-100 px-3 md:px-4 py-2 md:py-3 border-b border-gray-200 flex justify-between items-center">
            <span className="text-xs md:text-sm font-bold text-gray-700 flex items-center gap-2">
              <MessageCircle className="w-3 h-3 md:w-4 md:h-4 text-gray-500" />
              실시간 처리 로그
            </span>
          </div>
          <div className="p-4 md:p-6 bg-gray-50 min-h-[160px] md:min-h-[200px] flex flex-col justify-end gap-3 md:gap-4">
            {step >= 1 && (
              <div className="flex justify-end animate-in slide-in-from-bottom-2 fade-in">
                <div className={`px-3 py-2 md:px-4 md:py-2.5 rounded-lg text-xs md:text-sm max-w-[85%] shadow-sm ${step === 1 ? 'bg-blue-100 text-blue-900 border border-blue-200' : 'bg-blue-600 text-white'}`}>
                  {step === 1 ? <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce"/> 말하는 중...</span> : "오늘 서울 날씨 어때?"}
                </div>
              </div>
            )}
            {step === 2 && (
              <div className="flex justify-center my-1 animate-in fade-in">
                <span className="text-[10px] md:text-xs font-medium text-gray-500 bg-white px-2 py-0.5 md:px-3 md:py-1 rounded-full border border-gray-200 shadow-sm flex items-center gap-1">
                  <Mic className="w-3 h-3" /> 음성 변환 완료
                </span>
              </div>
            )}
            {step === 3 && (
              <div className="flex justify-start animate-in slide-in-from-bottom-2 fade-in">
                <div className="bg-white border border-gray-200 px-3 py-2 md:px-4 md:py-3 rounded-lg shadow-sm text-xs md:text-sm text-gray-500 flex items-center gap-2">
                  <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-purple-500 animate-spin-slow" /> 답변 생성 중...
                </div>
              </div>
            )}
            {step >= 4 && (
              <div className="flex justify-start animate-in slide-in-from-bottom-2 fade-in">
                 <div className={`px-3 py-2 md:px-4 md:py-3 rounded-lg text-xs md:text-sm max-w-[85%] border shadow-sm ${step === 4 ? 'bg-green-50 border-green-200 text-gray-800' : 'bg-white border-gray-200 text-gray-800'}`}>
                    {step === 4 ? <span className="text-green-700 font-medium flex items-center gap-2"><Volume2 className="w-3 h-3 md:w-4 md:h-4 animate-pulse"/> 답변 재생 중...</span> : "오늘은 맑고 화창한 날씨가 예상됩니다. ☀️"}
                 </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

// --- 메인 앱 컴포넌트 ---
export default function VoiceChatbotCalculator() {
  const [activeTab, setActiveTab] = useState('simulator');
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // --- 기존 로직 ---
  const [dau, setDau] = useState(1000);
  const [turnsPerSession, setTurnsPerSession] = useState(10);
  const [avgUserAudioSec, setAvgUserAudioSec] = useState(5);
  const [avgInputTokens, setAvgInputTokens] = useState(50);
  const [avgOutputTokens, setAvgOutputTokens] = useState(100);
  
  const [selectedSTT, setSelectedSTT] = useState(PRICING_DATA.stt[0]);
  const [selectedLLM, setSelectedLLM] = useState(PRICING_DATA.llm[1]);
  const [selectedTTS, setSelectedTTS] = useState(PRICING_DATA.tts[0]);

  const calculation = useMemo(() => {
    const daysInMonth = 30;
    const dailyAudioMinutes = (dau * turnsPerSession * avgUserAudioSec) / 60;
    const monthlyAudioMinutes = dailyAudioMinutes * daysInMonth;
    const sttCost = monthlyAudioMinutes * selectedSTT.costPerMin;
    const dailyInputTokens = dau * turnsPerSession * avgInputTokens;
    const dailyOutputTokens = dau * turnsPerSession * avgOutputTokens;
    const monthlyInputMillions = (dailyInputTokens * daysInMonth) / 1000000;
    const monthlyOutputMillions = (dailyOutputTokens * daysInMonth) / 1000000;
    const llmInputCost = monthlyInputMillions * selectedLLM.costInput;
    const llmOutputCost = monthlyOutputMillions * selectedLLM.costOutput;
    const llmCost = llmInputCost + llmOutputCost;
    const charsPerToken = 3; 
    const dailyChars = dailyOutputTokens * charsPerToken;
    const monthlyCharMillions = (dailyChars * daysInMonth) / 1000000;
    const ttsCost = monthlyCharMillions * selectedTTS.costPer1MChar;
    const totalMonthlyCost = sttCost + llmCost + ttsCost;
    return {
      monthly: { total: totalMonthlyCost, stt: sttCost, llm: llmCost, tts: ttsCost },
      volume: { minutes: monthlyAudioMinutes, tokens: (monthlyInputMillions + monthlyOutputMillions) * 1000000, chars: monthlyCharMillions * 1000000 },
      perUser: totalMonthlyCost / dau
    };
  }, [dau, turnsPerSession, avgUserAudioSec, avgInputTokens, avgOutputTokens, selectedSTT, selectedLLM, selectedTTS]);

  const applyPreset = (presetKey) => {
    const preset = PRESETS[presetKey];
    setSelectedSTT(PRICING_DATA.stt.find(p => p.id === preset.stt));
    setSelectedLLM(PRICING_DATA.llm.find(p => p.id === preset.llm));
    setSelectedTTS(PRICING_DATA.tts.find(p => p.id === preset.tts));
  };

  const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(val);
  const formatNumber = (val) => new Intl.NumberFormat('en-US').format(Math.round(val));

  // --- 공유하기(클립보드 복사) 기능 ---
  const handleShare = () => {
    const report = `
[AI 음성 챗봇 비용 견적서]

1. 트래픽 설정
- DAU (일간 사용자): ${formatNumber(dau)}명
- 세션당 턴 수: ${turnsPerSession}회
- 턴당 음성 길이: ${avgUserAudioSec}초

2. 모델 구성
- STT: ${selectedSTT.name} ($${selectedSTT.costPerMin}/min)
- LLM: ${selectedLLM.name}
- TTS: ${selectedTTS.name} ($${selectedTTS.costPer1MChar}/1M char)

3. 예상 비용 (30일 기준)
--------------------------------
총 월간 비용: ${formatCurrency(calculation.monthly.total)}
--------------------------------
- STT: ${formatCurrency(calculation.monthly.stt)}
- LLM: ${formatCurrency(calculation.monthly.llm)}
- TTS: ${formatCurrency(calculation.monthly.tts)}

* 유저 1인당 월 비용: ${formatCurrency(calculation.perUser)}
    `.trim();

    // iframe 환경 호환성을 위해 execCommand 사용 (fallback)
    const textArea = document.createElement("textarea");
    textArea.value = report;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.error('Copy failed', err);
      alert('클립보드 복사에 실패했습니다.');
    }
    document.body.removeChild(textArea);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 p-3 md:p-6 relative">
      <PricingModal isOpen={isPricingModalOpen} onClose={() => setIsPricingModalOpen(false)} />

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-gray-900 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-300">
          <ClipboardCheck className="w-5 h-5 text-green-400" />
          <span className="font-bold text-sm">견적서가 클립보드에 복사되었습니다!</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
        
        {/* 헤더 및 탭 스위처 */}
        <div className="flex flex-col items-center justify-center text-center space-y-4 md:space-y-6 pb-4 md:pb-6 border-b border-gray-200">
          <div>
            <h1 className="text-xl md:text-3xl font-bold text-gray-900 flex items-center justify-center gap-2 md:gap-3">
              <Zap className="w-6 h-6 md:w-8 md:h-8 text-blue-700 fill-blue-700" />
              AI Voice Chatbot Planner
            </h1>
            <p className="text-xs md:text-lg text-gray-500 mt-1 md:mt-2 px-4 break-keep">
              음성 챗봇 서비스의 비용 구조와 동작 원리를 기획합니다.
            </p>
          </div>

          <div className="bg-gray-200 p-1 rounded-lg inline-flex shadow-inner w-full max-w-sm md:w-auto">
            <button
              onClick={() => setActiveTab('simulator')}
              className={`flex-1 md:flex-none px-4 md:px-8 py-2 md:py-2.5 rounded-md text-xs md:text-sm font-bold transition-all duration-200 ${activeTab === 'simulator' ? 'bg-white text-blue-800 shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}
            >
              비용 시뮬레이터
            </button>
            <button
              onClick={() => setActiveTab('pipeline')}
              className={`flex-1 md:flex-none px-4 md:px-8 py-2 md:py-2.5 rounded-md text-xs md:text-sm font-bold transition-all duration-200 ${activeTab === 'pipeline' ? 'bg-white text-blue-800 shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}
            >
              파이프라인 동작
            </button>
          </div>
        </div>

        {/* 메인 콘텐츠 영역 */}
        <div className="transition-all duration-300">
          {activeTab === 'pipeline' ? (
            <PipelineAnimation />
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {/* 프리셋 버튼 그룹 */}
              <div className="flex justify-end gap-2 mb-4 md:mb-6 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                 {Object.entries(PRESETS).map(([key, preset]) => (
                  <button
                    key={key}
                    onClick={() => applyPreset(key)}
                    className="flex-shrink-0 px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm bg-white border border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-700 rounded-md transition-colors shadow-sm font-medium whitespace-nowrap"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-8">
                {/* 좌측: 설정 패널 */}
                <div className="lg:col-span-7 space-y-4 md:space-y-8">
                  {/* 트래픽 설정 */}
                  <Card className="p-4 md:p-6">
                    <h2 className="text-base md:text-lg font-bold flex items-center gap-2 mb-4 md:mb-6 text-gray-900 border-b pb-2 border-gray-100">
                      <Users className="w-4 h-4 md:w-5 md:h-5 text-blue-700" />
                      트래픽 및 사용 패턴 설정
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                      {[
                        { label: "일간 활성 유저 (DAU)", val: dau, set: setDau, min: 100, max: 100000, step: 100, unit: "명" },
                        { label: "세션당 대화 턴 수", val: turnsPerSession, set: setTurnsPerSession, min: 1, max: 50, step: 1, unit: "회" },
                        { label: "유저 발화 평균 길이", val: avgUserAudioSec, set: setAvgUserAudioSec, min: 1, max: 30, step: 1, unit: "초" },
                        { label: "LLM 답변 길이", val: avgOutputTokens, set: setAvgOutputTokens, min: 20, max: 500, step: 10, unit: "토큰" },
                      ].map((item, idx) => (
                        <div key={idx} className="space-y-2 md:space-y-3">
                          <label className="text-xs md:text-sm font-semibold text-gray-700 flex justify-between">
                            {item.label}
                            <span className="text-blue-700">{formatNumber(item.val)}{item.unit}</span>
                          </label>
                          <input 
                            type="range" 
                            min={item.min} max={item.max} step={item.step} 
                            value={item.val} 
                            onChange={(e) => item.set(Number(e.target.value))} 
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-700"
                          />
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* 모델 선택 */}
                  <Card className="p-4 md:p-6">
                    <div className="flex justify-between items-center mb-4 md:mb-6 border-b pb-2 border-gray-100">
                      <h2 className="text-base md:text-lg font-bold flex items-center gap-2 text-gray-900">
                        <Settings className="w-4 h-4 md:w-5 md:h-5 text-blue-700" />
                        파이프라인 모델 선택
                      </h2>
                      <button 
                        onClick={() => setIsPricingModalOpen(true)}
                        className="flex items-center gap-1 px-2 py-1 md:px-3 md:py-1.5 text-[10px] md:text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors border border-blue-200"
                      >
                        <FileText className="w-3 h-3 md:w-3.5 md:h-3.5" />
                        상세 가격표
                      </button>
                    </div>
                    
                    <div className="space-y-4 md:space-y-6">
                      {[
                        { title: "Input: STT", fullTitle: "Speech to Text", icon: Mic, list: PRICING_DATA.stt, selected: selectedSTT, setter: setSelectedSTT, priceKey: "costPerMin", unit: "/min" },
                        { title: "Process: LLM", fullTitle: "Large Language Model", icon: Brain, list: PRICING_DATA.llm, selected: selectedLLM, setter: setSelectedLLM, priceKey: "costInput", unit: " (In)" },
                        { title: "Output: TTS", fullTitle: "Text to Speech", icon: Volume2, list: PRICING_DATA.tts, selected: selectedTTS, setter: setSelectedTTS, priceKey: "costPer1MChar", unit: "/1M Char" }
                      ].map((section, idx) => (
                        <div key={idx} className="p-3 md:p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="flex items-center gap-2 mb-2 md:mb-3">
                            <section.icon className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
                            <span className="font-bold text-sm md:text-base text-gray-800">
                              <span className="md:hidden">{section.title}</span>
                              <span className="hidden md:inline">{section.fullTitle || section.title}</span>
                            </span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                            {section.list.map((model) => (
                              <button
                                key={model.id}
                                onClick={() => section.setter(model)}
                                className={`text-left p-2 md:p-3 rounded-lg border transition-all relative ${
                                  section.selected.id === model.id 
                                    ? 'border-blue-600 bg-white ring-2 ring-blue-100 z-10' 
                                    : 'border-gray-200 bg-white hover:border-gray-400'
                                }`}
                              >
                                <div className="flex justify-between items-start">
                                  <div className={`font-bold text-xs md:text-sm ${section.selected.id === model.id ? 'text-blue-700' : 'text-gray-900'}`}>{model.name}</div>
                                  {section.selected.id === model.id && <Check className="w-3 h-3 md:w-4 md:h-4 text-blue-600" />}
                                </div>
                                <div className="text-[10px] md:text-xs text-gray-500 mt-0.5 md:mt-1">{model.provider}</div>
                                <div className="text-[10px] md:text-xs font-bold text-gray-600 mt-0.5 md:mt-1">
                                  ${model[section.priceKey]} {section.unit}
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>

                {/* 우측: 결과 패널 */}
                <div className="lg:col-span-5 space-y-4 md:space-y-6">
                  {/* 총 비용 카드 */}
                  <Card className="p-4 md:p-6 bg-white border-2 border-gray-200 relative overflow-hidden">
                    <div className="flex justify-between items-start mb-4 md:mb-6">
                      <h2 className="text-base md:text-lg font-bold text-gray-900 flex items-center gap-2">
                        <Calculator className="w-4 h-4 md:w-5 md:h-5 text-blue-700" />
                        예상 월간 비용
                      </h2>
                      {/* 공유 버튼 */}
                      <button 
                        onClick={handleShare}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-xs font-bold transition-colors"
                        title="견적서 복사하기"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">견적서 복사</span>
                      </button>
                    </div>

                    <div className="mb-6 md:mb-8 text-center bg-gray-50 py-6 md:py-10 rounded-lg border border-gray-200">
                      <div className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">
                        {formatCurrency(calculation.monthly.total)}
                      </div>
                      <div className="text-gray-500 text-xs md:text-sm mt-2 md:mt-3 font-medium">
                        DAU {formatNumber(dau)}명 기준 / 30일
                      </div>
                    </div>

                    <div className="space-y-4 md:space-y-5">
                      {[
                        { label: "STT (인식)", val: calculation.monthly.stt, total: calculation.monthly.total, color: "bg-blue-600" },
                        { label: "LLM (지능)", val: calculation.monthly.llm, total: calculation.monthly.total, color: "bg-indigo-600" },
                        { label: "TTS (발화)", val: calculation.monthly.tts, total: calculation.monthly.total, color: "bg-cyan-600" }
                      ].map((bar, idx) => (
                        <div key={idx}>
                          <div className="flex justify-between text-xs md:text-sm mb-1 md:mb-1.5">
                            <span className="text-gray-600 font-bold">{bar.label}</span>
                            <span className="font-mono font-semibold text-gray-900">{formatCurrency(bar.val)}</span>
                          </div>
                          <div className="h-2 md:h-2.5 bg-gray-100 rounded-full overflow-hidden border border-gray-100">
                            <div className={`h-full ${bar.color} transition-all duration-500`} style={{ width: `${(bar.val / bar.total) * 100}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-xs md:text-sm font-bold">유저 1인당 월 비용</span>
                        <span className="text-lg md:text-xl font-black text-gray-900">{formatCurrency(calculation.perUser)}</span>
                      </div>
                    </div>
                  </Card>

                  {/* 리소스 사용량 */}
                  <Card className="p-4 md:p-6">
                    <h3 className="font-bold text-gray-900 mb-3 md:mb-4 flex items-center gap-2 text-xs md:text-sm">
                      <Info className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-500" />
                      월간 예상 리소스 사용량
                    </h3>
                    <div className="space-y-2 md:space-y-3 text-xs md:text-sm">
                      {[
                        { label: "총 음성 입력 시간", val: calculation.volume.minutes, unit: "분" },
                        { label: "총 LLM 토큰", val: calculation.volume.tokens, unit: "개" },
                        { label: "총 합성 글자 수", val: calculation.volume.chars, unit: "자" }
                      ].map((item, idx) => (
                         <div key={idx} className="flex justify-between p-2 md:p-3 bg-gray-50 rounded border border-gray-100">
                          <span className="text-gray-600">{item.label}</span>
                          <span className="font-mono font-bold text-gray-900">{formatNumber(item.val)} {item.unit}</span>
                        </div>
                      ))}
                      <p className="text-[10px] md:text-xs text-gray-400 mt-2 px-1">
                        * 리소스 사용량은 사용자 트래픽과 패턴에 의해 결정됩니다.
                      </p>
                    </div>
                  </Card>

                   {/* 기획자 코멘트 */}
                   <div className="bg-blue-50 p-4 md:p-5 rounded-lg border border-blue-100">
                      <h4 className="text-blue-800 font-bold mb-1 md:mb-2 text-xs md:text-sm flex items-center gap-2">
                        <Activity className="w-3.5 h-3.5 md:w-4 md:h-4"/> 비용 분석 인사이트
                      </h4>
                      <p className="text-blue-900 text-[11px] md:text-xs leading-relaxed font-medium">
                        현재 구성에서 가장 큰 비용 요인은 
                        <span className="font-extrabold underline decoration-blue-300 decoration-2 underline-offset-2 ml-1">
                          {
                            calculation.monthly.stt > calculation.monthly.llm && calculation.monthly.stt > calculation.monthly.tts ? 'STT (음성 인식)' :
                            calculation.monthly.llm > calculation.monthly.stt && calculation.monthly.llm > calculation.monthly.tts ? 'LLM (언어 모델)' : 'TTS (음성 합성)'
                          }
                        </span>
                        입니다.
                      </p>
                   </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}