import { useState, useEffect } from 'react';
import { 
  Users, Mic, Brain, Volume2, 
  Play, Pause, RotateCcw, 
  ChevronLeft, ChevronRight, 
  MessageCircle, Sparkles 
} from 'lucide-react';
import Card from './Card';

// 파이프라인 단계 정의
const PIPELINE_STEPS = [
  { id: 1, label: 'User', icon: Users, desc: '음성 입력' },
  { id: 2, label: 'STT', icon: Mic, desc: '텍스트 변환' },
  { id: 3, label: 'LLM', icon: Brain, desc: '답변 생성' },
  { id: 4, label: 'TTS', icon: Volume2, desc: '음성 합성' },
];

// 애니메이션 딜레이 설정
const ANIMATION_DELAYS = {
  initial: 100,
  llm: 2500,
  default: 2000,
  reset: 3000
};

/**
 * 파이프라인 동작 애니메이션 컴포넌트
 * 음성 챗봇의 처리 흐름을 시각적으로 표현
 */
const PipelineAnimation = () => {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // 자동 재생 로직
  useEffect(() => {
    if (!isPlaying) return;

    const getDelay = () => {
      if (step === 0) return ANIMATION_DELAYS.initial;
      if (step === 3) return ANIMATION_DELAYS.llm;
      return ANIMATION_DELAYS.default;
    };

    const timer = setTimeout(() => {
      if (step < 5) {
        setStep(prev => prev + 1);
      } else {
        setIsPlaying(false);
        setStep(0);
      }
    }, step < 5 ? getDelay() : ANIMATION_DELAYS.reset);

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

  const handlePrevStep = () => {
    setIsPlaying(false);
    setStep(prev => Math.max(0, prev - 1));
  };

  const handleNextStep = () => {
    setIsPlaying(false);
    setStep(prev => Math.min(5, prev + 1));
  };

  const handleStepClick = (stepId) => {
    setIsPlaying(false);
    setStep(stepId);
  };

  return (
    <div className="py-4 md:py-8 max-w-5xl mx-auto animate-in fade-in duration-500">
      <ControlPanel 
        step={step}
        isPlaying={isPlaying}
        onTogglePlay={togglePlay}
        onPrev={handlePrevStep}
        onNext={handleNextStep}
      />
      <ProcessDiagram 
        step={step} 
        onStepClick={handleStepClick} 
      />
      <ConversationLog step={step} />
    </div>
  );
};

/**
 * 컨트롤 패널 서브 컴포넌트
 */
const ControlPanel = ({ step, isPlaying, onTogglePlay, onPrev, onNext }) => (
  <div className="flex flex-col items-center mb-6 md:mb-10 gap-4">
    <div className="flex items-center gap-2 md:gap-3 bg-white p-1.5 md:p-2 rounded-lg shadow-sm border border-gray-300">
      <button 
        onClick={onPrev}
        disabled={step === 0}
        className="p-2 md:p-3 rounded hover:bg-gray-100 text-gray-600 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors border border-transparent hover:border-gray-200"
        aria-label="이전 단계"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button 
        onClick={onTogglePlay} 
        className={`px-4 md:px-8 py-2 md:py-3 rounded font-bold text-sm md:text-lg flex items-center justify-center gap-2 transition-all min-w-[130px] md:min-w-[160px] ${
          isPlaying 
            ? 'bg-white text-blue-700 border border-blue-200 hover:bg-blue-50' 
            : 'bg-blue-700 text-white hover:bg-blue-800 shadow-sm'
        }`}
      >
        {isPlaying ? (
          <>
            <Pause className="w-4 h-4 md:w-5 md:h-5 fill-current" /> 
            <span className="hidden md:inline">일시 정지</span>
            <span className="md:hidden">정지</span>
          </>
        ) : (
          <>
            <Play className="w-4 h-4 md:w-5 md:h-5 fill-current" /> 
            <span className="md:hidden">{step === 0 || step === 5 ? '재생' : '계속'}</span>
            <span className="hidden md:inline">{step === 0 || step === 5 ? '자동 재생' : '계속 재생'}</span>
          </>
        )}
      </button>

      <button 
        onClick={onNext}
        disabled={step === 5}
        className="p-2 md:p-3 rounded hover:bg-gray-100 text-gray-600 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors border border-transparent hover:border-gray-200"
        aria-label="다음 단계"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
    
    <p className="text-gray-500 text-xs md:text-sm font-medium">
      {isPlaying ? (
        <span className="flex items-center gap-1.5 text-blue-700">
          <RotateCcw className="w-3 md:w-3.5 h-3 md:h-3.5 animate-spin-slow" /> 
          시뮬레이션 중...
        </span>
      ) : '재생 버튼을 누르거나 화살표로 이동'}
    </p>
  </div>
);

/**
 * 프로세스 다이어그램 서브 컴포넌트
 */
const ProcessDiagram = ({ step, onStepClick }) => (
  <div className="relative mb-8 md:mb-12 px-2 md:px-12">
    {/* 배경 라인 */}
    <div className="absolute top-1/2 left-6 md:left-12 right-6 md:right-12 h-1.5 md:h-2 bg-gray-200 -z-10 rounded-full" />
    
    {/* 진행 라인 */}
    <div 
      className="absolute top-1/2 left-6 md:left-12 h-1.5 md:h-2 bg-blue-600 -z-10 transition-all duration-700 ease-in-out rounded-full"
      style={{ width: `calc(${Math.min((step / 4) * 100, 100)}% - 3rem)` }}
    />

    <div className="grid grid-cols-4 gap-1 md:gap-4">
      {PIPELINE_STEPS.map((s, idx) => (
        <StepNode 
          key={s.id}
          step={s}
          isActive={step === s.id}
          isPassed={step > s.id}
          showPacketAnimation={step === s.id && idx < 3}
          onClick={() => onStepClick(s.id)}
        />
      ))}
    </div>
  </div>
);

/**
 * 개별 단계 노드 서브 컴포넌트
 */
const StepNode = ({ step: s, isActive, isPassed, showPacketAnimation, onClick }) => (
  <div 
    className="flex flex-col items-center relative group cursor-pointer" 
    onClick={onClick}
  >
    <div 
      className={`w-12 h-12 md:w-20 md:h-20 rounded-full flex items-center justify-center mb-2 md:mb-3 transition-all duration-300 border-2 z-10 bg-white
        ${isActive || isPassed 
          ? 'border-blue-600 text-blue-600 shadow-md scale-110' 
          : 'border-gray-300 text-gray-400 group-hover:border-gray-400'
        }
      `}
    >
      <s.icon className="w-5 h-5 md:w-8 md:h-8" />
      {isActive && (
        <div className="absolute inset-0 rounded-full animate-ping opacity-10 bg-blue-600" />
      )}
    </div>
    
    <div className="text-center w-full">
      <h3 className={`font-bold text-[10px] md:text-base leading-tight ${isActive ? 'text-blue-800' : 'text-gray-600'}`}>
        {s.label}
      </h3>
      <p className="hidden md:block text-xs text-gray-500 mt-1">{s.desc}</p>
    </div>
    
    {/* 데이터 패킷 애니메이션 */}
    {showPacketAnimation && (
      <div className="absolute top-[24px] md:top-[40px] -right-[50%] w-full flex justify-center items-center z-0">
        <div className="w-2 h-2 md:w-3 md:h-3 bg-blue-500 rounded-full animate-[slideRight_1.5s_linear_infinite]" />
      </div>
    )}
  </div>
);

/**
 * 대화 로그 서브 컴포넌트
 */
const ConversationLog = ({ step }) => (
  <div className="max-w-xl mx-auto">
    <Card className="overflow-hidden border-gray-300">
      <div className="bg-gray-100 px-3 md:px-4 py-2 md:py-3 border-b border-gray-200 flex justify-between items-center">
        <span className="text-xs md:text-sm font-bold text-gray-700 flex items-center gap-2">
          <MessageCircle className="w-3 h-3 md:w-4 md:h-4 text-gray-500" />
          실시간 처리 로그
        </span>
      </div>
      
      <div className="p-4 md:p-6 bg-gray-50 min-h-[160px] md:min-h-[200px] flex flex-col justify-end gap-3 md:gap-4">
        {/* 사용자 입력 */}
        {step >= 1 && (
          <div className="flex justify-end animate-in slide-in-from-bottom-2 fade-in">
            <div className={`px-3 py-2 md:px-4 md:py-2.5 rounded-lg text-xs md:text-sm max-w-[85%] shadow-sm ${
              step === 1 
                ? 'bg-blue-100 text-blue-900 border border-blue-200' 
                : 'bg-blue-600 text-white'
            }`}>
              {step === 1 ? (
                <span className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" /> 
                  말하는 중...
                </span>
              ) : '오늘 서울 날씨 어때?'}
            </div>
          </div>
        )}
        
        {/* STT 완료 표시 */}
        {step === 2 && (
          <div className="flex justify-center my-1 animate-in fade-in">
            <span className="text-[10px] md:text-xs font-medium text-gray-500 bg-white px-2 py-0.5 md:px-3 md:py-1 rounded-full border border-gray-200 shadow-sm flex items-center gap-1">
              <Mic className="w-3 h-3" /> 음성 변환 완료
            </span>
          </div>
        )}
        
        {/* LLM 처리 중 */}
        {step === 3 && (
          <div className="flex justify-start animate-in slide-in-from-bottom-2 fade-in">
            <div className="bg-white border border-gray-200 px-3 py-2 md:px-4 md:py-3 rounded-lg shadow-sm text-xs md:text-sm text-gray-500 flex items-center gap-2">
              <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-purple-500 animate-spin-slow" /> 
              답변 생성 중...
            </div>
          </div>
        )}
        
        {/* AI 응답 */}
        {step >= 4 && (
          <div className="flex justify-start animate-in slide-in-from-bottom-2 fade-in">
            <div className={`px-3 py-2 md:px-4 md:py-3 rounded-lg text-xs md:text-sm max-w-[85%] border shadow-sm ${
              step === 4 
                ? 'bg-green-50 border-green-200 text-gray-800' 
                : 'bg-white border-gray-200 text-gray-800'
            }`}>
              {step === 4 ? (
                <span className="text-green-700 font-medium flex items-center gap-2">
                  <Volume2 className="w-3 h-3 md:w-4 md:h-4 animate-pulse" /> 
                  답변 재생 중...
                </span>
              ) : '오늘은 맑고 화창한 날씨가 예상됩니다. ☀️'}
            </div>
          </div>
        )}
      </div>
    </Card>
  </div>
);

export default PipelineAnimation;

