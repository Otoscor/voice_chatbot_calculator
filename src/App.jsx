import { useState } from 'react';
import { Zap } from 'lucide-react';

// 컴포넌트
import {
  Toast,
  PricingModal,
  PipelineAnimation,
  TrafficSettings,
  ModelSelector,
  CostResult,
  PresetButtons
} from './components';

// 상수 및 유틸리티
import { PRICING_DATA, PRESETS, DEFAULT_SELECTIONS } from './constants/pricing';
import { formatCurrency, formatNumber } from './utils/formatters';
import { useCalculation } from './hooks/useCalculation';

/**
 * AI Voice Chatbot Planner 메인 앱
 */
export default function App() {
  // UI 상태
  const [activeTab, setActiveTab] = useState('simulator');
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // 트래픽 설정 상태
  const [dau, setDau] = useState(1000);
  const [turnsPerSession, setTurnsPerSession] = useState(10);
  const [avgUserAudioSec, setAvgUserAudioSec] = useState(5);
  const [avgInputTokens] = useState(50);
  const [avgOutputTokens, setAvgOutputTokens] = useState(100);
  
  // 모델 선택 상태
  const [selectedSTT, setSelectedSTT] = useState(PRICING_DATA.stt[DEFAULT_SELECTIONS.stt]);
  const [selectedLLM, setSelectedLLM] = useState(PRICING_DATA.llm[DEFAULT_SELECTIONS.llm]);
  const [selectedTTS, setSelectedTTS] = useState(PRICING_DATA.tts[DEFAULT_SELECTIONS.tts]);

  // 비용 계산
  const calculation = useCalculation({
    dau,
    turnsPerSession,
    avgUserAudioSec,
    avgInputTokens,
    avgOutputTokens,
    selectedSTT,
    selectedLLM,
    selectedTTS
  });

  // 프리셋 적용
  const handleApplyPreset = (presetKey) => {
    const preset = PRESETS[presetKey];
    setSelectedSTT(PRICING_DATA.stt.find(p => p.id === preset.stt));
    setSelectedLLM(PRICING_DATA.llm.find(p => p.id === preset.llm));
    setSelectedTTS(PRICING_DATA.tts.find(p => p.id === preset.tts));
  };

  // 견적서 복사
  const handleShare = () => {
    const report = generateReport();
    copyToClipboard(report);
  };

  const generateReport = () => `
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

  const copyToClipboard = (text) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
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
      {/* 모달 & 토스트 */}
      <PricingModal 
        isOpen={isPricingModalOpen} 
        onClose={() => setIsPricingModalOpen(false)} 
      />
      <Toast 
        show={showToast} 
        message="견적서가 클립보드에 복사되었습니다!" 
      />

      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
        {/* 헤더 */}
        <Header activeTab={activeTab} onTabChange={setActiveTab} />

        {/* 메인 콘텐츠 */}
        <main className="transition-all duration-300">
          {activeTab === 'pipeline' ? (
            <PipelineAnimation />
          ) : (
            <SimulatorContent 
              dau={dau}
              setDau={setDau}
              turnsPerSession={turnsPerSession}
              setTurnsPerSession={setTurnsPerSession}
              avgUserAudioSec={avgUserAudioSec}
              setAvgUserAudioSec={setAvgUserAudioSec}
              avgOutputTokens={avgOutputTokens}
              setAvgOutputTokens={setAvgOutputTokens}
              selectedSTT={selectedSTT}
              setSelectedSTT={setSelectedSTT}
              selectedLLM={selectedLLM}
              setSelectedLLM={setSelectedLLM}
              selectedTTS={selectedTTS}
              setSelectedTTS={setSelectedTTS}
              calculation={calculation}
              onApplyPreset={handleApplyPreset}
              onShare={handleShare}
              onOpenPricing={() => setIsPricingModalOpen(true)}
            />
          )}
        </main>
      </div>
    </div>
  );
}

/**
 * 헤더 컴포넌트
 */
const Header = ({ activeTab, onTabChange }) => (
  <header className="flex flex-col items-center justify-center text-center space-y-4 md:space-y-6 pb-4 md:pb-6 border-b border-gray-200">
    <div>
      <h1 className="text-xl md:text-3xl font-bold text-gray-900 flex items-center justify-center gap-2 md:gap-3">
        <Zap className="w-6 h-6 md:w-8 md:h-8 text-blue-700 fill-blue-700" />
        AI Voice Chatbot Planner
      </h1>
      <p className="text-xs md:text-lg text-gray-500 mt-1 md:mt-2 px-4 break-keep">
        음성 챗봇 서비스의 비용 구조와 동작 원리를 기획합니다.
      </p>
    </div>

    <TabSwitcher activeTab={activeTab} onTabChange={onTabChange} />
  </header>
);

/**
 * 탭 스위처 컴포넌트
 */
const TabSwitcher = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'simulator', label: '비용 시뮬레이터' },
    { id: 'pipeline', label: '파이프라인 동작' }
  ];

  return (
    <div className="bg-gray-200 p-1 rounded-lg inline-flex shadow-inner w-full max-w-sm md:w-auto">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex-1 md:flex-none px-4 md:px-8 py-2 md:py-2.5 rounded-md text-xs md:text-sm font-bold transition-all duration-200 ${
            activeTab === tab.id 
              ? 'bg-white text-blue-800 shadow-sm' 
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

/**
 * 시뮬레이터 콘텐츠 컴포넌트
 */
const SimulatorContent = ({
  dau, setDau,
  turnsPerSession, setTurnsPerSession,
  avgUserAudioSec, setAvgUserAudioSec,
  avgOutputTokens, setAvgOutputTokens,
  selectedSTT, setSelectedSTT,
  selectedLLM, setSelectedLLM,
  selectedTTS, setSelectedTTS,
  calculation,
  onApplyPreset,
  onShare,
  onOpenPricing
}) => (
  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
    <PresetButtons onApplyPreset={onApplyPreset} />

    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-8">
      {/* 좌측: 설정 패널 */}
      <div className="lg:col-span-7 space-y-4 md:space-y-8">
        <TrafficSettings 
          dau={dau}
          setDau={setDau}
          turnsPerSession={turnsPerSession}
          setTurnsPerSession={setTurnsPerSession}
          avgUserAudioSec={avgUserAudioSec}
          setAvgUserAudioSec={setAvgUserAudioSec}
          avgOutputTokens={avgOutputTokens}
          setAvgOutputTokens={setAvgOutputTokens}
        />
        <ModelSelector 
          selectedSTT={selectedSTT}
          setSelectedSTT={setSelectedSTT}
          selectedLLM={selectedLLM}
          setSelectedLLM={setSelectedLLM}
          selectedTTS={selectedTTS}
          setSelectedTTS={setSelectedTTS}
          onOpenPricing={onOpenPricing}
        />
      </div>

      {/* 우측: 결과 패널 */}
      <div className="lg:col-span-5">
        <CostResult 
          calculation={calculation} 
          dau={dau} 
          onShare={onShare} 
        />
      </div>
    </div>
  </div>
);
