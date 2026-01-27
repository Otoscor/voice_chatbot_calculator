import { Calculator, Share2, Info, Activity } from 'lucide-react';
import Card from './Card';
import { formatCurrency, formatNumber } from '../utils/formatters';

/**
 * 비용 결과 패널 컴포넌트
 */
const CostResult = ({ calculation, dau, onShare }) => {
  return (
    <div className="space-y-4 md:space-y-6">
      <TotalCostCard 
        calculation={calculation} 
        dau={dau} 
        onShare={onShare} 
      />
      <ResourceUsageCard calculation={calculation} />
      <InsightCard calculation={calculation} />
    </div>
  );
};

/**
 * 총 비용 카드 서브 컴포넌트
 */
const TotalCostCard = ({ calculation, dau, onShare }) => {
  const costBars = [
    { label: 'STT (인식)', value: calculation.monthly.stt, color: 'bg-blue-600' },
    { label: 'LLM (지능)', value: calculation.monthly.llm, color: 'bg-indigo-600' },
    { label: 'TTS (발화)', value: calculation.monthly.tts, color: 'bg-cyan-600' }
  ];

  return (
    <Card className="p-4 md:p-6 bg-white border-2 border-gray-200 relative overflow-hidden">
      <div className="flex justify-between items-start mb-4 md:mb-6">
        <h2 className="text-base md:text-lg font-bold text-gray-900 flex items-center gap-2">
          <Calculator className="w-4 h-4 md:w-5 md:h-5 text-blue-700" />
          예상 월간 비용
        </h2>
        <button 
          onClick={onShare}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-xs font-bold transition-colors"
          title="견적서 복사하기"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">견적서 복사</span>
        </button>
      </div>

      {/* 총 비용 표시 */}
      <div className="mb-6 md:mb-8 text-center bg-gray-50 py-6 md:py-10 rounded-lg border border-gray-200">
        <div className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">
          {formatCurrency(calculation.monthly.total)}
        </div>
        <div className="text-gray-500 text-xs md:text-sm mt-2 md:mt-3 font-medium">
          DAU {formatNumber(dau)}명 기준 / 30일
        </div>
      </div>

      {/* 비용 분포 막대 */}
      <div className="space-y-4 md:space-y-5">
        {costBars.map((bar, idx) => (
          <CostBar 
            key={idx}
            label={bar.label}
            value={bar.value}
            total={calculation.monthly.total}
            color={bar.color}
          />
        ))}
      </div>

      {/* 유저당 비용 */}
      <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 text-xs md:text-sm font-bold">유저 1인당 월 비용</span>
          <span className="text-lg md:text-xl font-black text-gray-900">
            {formatCurrency(calculation.perUser)}
          </span>
        </div>
      </div>
    </Card>
  );
};

/**
 * 비용 막대 서브 컴포넌트
 */
const CostBar = ({ label, value, total, color }) => (
  <div>
    <div className="flex justify-between text-xs md:text-sm mb-1 md:mb-1.5">
      <span className="text-gray-600 font-bold">{label}</span>
      <span className="font-mono font-semibold text-gray-900">{formatCurrency(value)}</span>
    </div>
    <div className="h-2 md:h-2.5 bg-gray-100 rounded-full overflow-hidden border border-gray-100">
      <div 
        className={`h-full ${color} transition-all duration-500`} 
        style={{ width: `${(value / total) * 100}%` }}
      />
    </div>
  </div>
);

/**
 * 리소스 사용량 카드 서브 컴포넌트
 */
const ResourceUsageCard = ({ calculation }) => {
  const resources = [
    { label: '총 음성 입력 시간', value: calculation.volume.minutes, unit: '분' },
    { label: '총 LLM 토큰', value: calculation.volume.tokens, unit: '개' },
    { label: '총 합성 글자 수', value: calculation.volume.chars, unit: '자' }
  ];

  return (
    <Card className="p-4 md:p-6">
      <h3 className="font-bold text-gray-900 mb-3 md:mb-4 flex items-center gap-2 text-xs md:text-sm">
        <Info className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-500" />
        월간 예상 리소스 사용량
      </h3>
      
      <div className="space-y-2 md:space-y-3 text-xs md:text-sm">
        {resources.map((item, idx) => (
          <div key={idx} className="flex justify-between p-2 md:p-3 bg-gray-50 rounded border border-gray-100">
            <span className="text-gray-600">{item.label}</span>
            <span className="font-mono font-bold text-gray-900">
              {formatNumber(item.value)} {item.unit}
            </span>
          </div>
        ))}
        <p className="text-[10px] md:text-xs text-gray-400 mt-2 px-1">
          * 리소스 사용량은 사용자 트래픽과 패턴에 의해 결정됩니다.
        </p>
      </div>
    </Card>
  );
};

/**
 * 인사이트 카드 서브 컴포넌트
 */
const InsightCard = ({ calculation }) => {
  const { stt, llm, tts } = calculation.monthly;
  
  const getHighestCostFactor = () => {
    if (stt > llm && stt > tts) return 'STT (음성 인식)';
    if (llm > stt && llm > tts) return 'LLM (언어 모델)';
    return 'TTS (음성 합성)';
  };

  return (
    <div className="bg-blue-50 p-4 md:p-5 rounded-lg border border-blue-100">
      <h4 className="text-blue-800 font-bold mb-1 md:mb-2 text-xs md:text-sm flex items-center gap-2">
        <Activity className="w-3.5 h-3.5 md:w-4 md:h-4" /> 
        비용 분석 인사이트
      </h4>
      <p className="text-blue-900 text-[11px] md:text-xs leading-relaxed font-medium">
        현재 구성에서 가장 큰 비용 요인은 
        <span className="font-extrabold underline decoration-blue-300 decoration-2 underline-offset-2 ml-1">
          {getHighestCostFactor()}
        </span>
        입니다.
      </p>
    </div>
  );
};

export default CostResult;

