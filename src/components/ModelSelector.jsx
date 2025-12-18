import { Settings, FileText, Mic, Brain, Volume2, Check } from 'lucide-react';
import Card from './Card';
import { PRICING_DATA } from '../constants/pricing';

/**
 * 파이프라인 모델 선택 컴포넌트
 */
const ModelSelector = ({ 
  selectedSTT, setSelectedSTT,
  selectedLLM, setSelectedLLM,
  selectedTTS, setSelectedTTS,
  onOpenPricing
}) => {
  const sections = [
    { 
      title: 'Input: STT', 
      fullTitle: 'Speech to Text', 
      icon: Mic, 
      list: PRICING_DATA.stt, 
      selected: selectedSTT, 
      setter: setSelectedSTT, 
      priceKey: 'costPerMin', 
      unit: '/min' 
    },
    { 
      title: 'Process: LLM', 
      fullTitle: 'Large Language Model', 
      icon: Brain, 
      list: PRICING_DATA.llm, 
      selected: selectedLLM, 
      setter: setSelectedLLM, 
      priceKey: 'costInput', 
      unit: ' (In)' 
    },
    { 
      title: 'Output: TTS', 
      fullTitle: 'Text to Speech', 
      icon: Volume2, 
      list: PRICING_DATA.tts, 
      selected: selectedTTS, 
      setter: setSelectedTTS, 
      priceKey: 'costPer1MChar', 
      unit: '/1M Char' 
    }
  ];

  return (
    <Card className="p-4 md:p-6">
      <div className="flex justify-between items-center mb-4 md:mb-6 border-b pb-2 border-gray-100">
        <h2 className="text-base md:text-lg font-bold flex items-center gap-2 text-gray-900">
          <Settings className="w-4 h-4 md:w-5 md:h-5 text-blue-700" />
          파이프라인 모델 선택
        </h2>
        <button 
          onClick={onOpenPricing}
          className="flex items-center gap-1 px-2 py-1 md:px-3 md:py-1.5 text-[10px] md:text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors border border-blue-200"
        >
          <FileText className="w-3 h-3 md:w-3.5 md:h-3.5" />
          상세 가격표
        </button>
      </div>
      
      <div className="space-y-4 md:space-y-6">
        {sections.map((section, idx) => (
          <ModelSection key={idx} {...section} />
        ))}
      </div>
    </Card>
  );
};

/**
 * 개별 모델 섹션 서브 컴포넌트
 */
const ModelSection = ({ title, fullTitle, icon: Icon, list, selected, setter, priceKey, unit }) => (
  <div className="p-3 md:p-4 bg-gray-50 rounded-lg border border-gray-200">
    <div className="flex items-center gap-2 mb-2 md:mb-3">
      <Icon className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
      <span className="font-bold text-sm md:text-base text-gray-800">
        <span className="md:hidden">{title}</span>
        <span className="hidden md:inline">{fullTitle || title}</span>
      </span>
    </div>
    
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
      {list.map((model) => (
        <ModelCard 
          key={model.id}
          model={model}
          isSelected={selected.id === model.id}
          onClick={() => setter(model)}
          priceKey={priceKey}
          unit={unit}
        />
      ))}
    </div>
  </div>
);

/**
 * 개별 모델 카드 서브 컴포넌트
 */
const ModelCard = ({ model, isSelected, onClick, priceKey, unit }) => (
  <button
    onClick={onClick}
    className={`text-left p-2 md:p-3 rounded-lg border transition-all relative ${
      isSelected 
        ? 'border-blue-600 bg-white ring-2 ring-blue-100 z-10' 
        : 'border-gray-200 bg-white hover:border-gray-400'
    }`}
  >
    <div className="flex justify-between items-start">
      <div className={`font-bold text-xs md:text-sm ${isSelected ? 'text-blue-700' : 'text-gray-900'}`}>
        {model.name}
      </div>
      {isSelected && <Check className="w-3 h-3 md:w-4 md:h-4 text-blue-600" />}
    </div>
    <div className="text-[10px] md:text-xs text-gray-500 mt-0.5 md:mt-1">
      {model.provider}
    </div>
    <div className="text-[10px] md:text-xs font-bold text-gray-600 mt-0.5 md:mt-1">
      ${model[priceKey]} {unit}
    </div>
  </button>
);

export default ModelSelector;

