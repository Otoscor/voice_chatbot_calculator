import { Users } from 'lucide-react';
import Card from './Card';
import { formatNumber } from '../utils/formatters';

/**
 * 트래픽 및 사용 패턴 설정 컴포넌트
 */
const TrafficSettings = ({ 
  dau, setDau,
  turnsPerSession, setTurnsPerSession,
  avgUserAudioSec, setAvgUserAudioSec,
  avgOutputTokens, setAvgOutputTokens
}) => {
  const sliderConfigs = [
    { 
      label: '일간 활성 유저 (DAU)', 
      value: dau, 
      setter: setDau, 
      min: 100, 
      max: 100000, 
      step: 100, 
      unit: '명' 
    },
    { 
      label: '세션당 대화 턴 수', 
      value: turnsPerSession, 
      setter: setTurnsPerSession, 
      min: 1, 
      max: 50, 
      step: 1, 
      unit: '회' 
    },
    { 
      label: '유저 발화 평균 길이', 
      value: avgUserAudioSec, 
      setter: setAvgUserAudioSec, 
      min: 1, 
      max: 30, 
      step: 1, 
      unit: '초' 
    },
    { 
      label: 'LLM 답변 길이', 
      value: avgOutputTokens, 
      setter: setAvgOutputTokens, 
      min: 20, 
      max: 500, 
      step: 10, 
      unit: '토큰' 
    },
  ];

  return (
    <Card className="p-4 md:p-6">
      <h2 className="text-base md:text-lg font-bold flex items-center gap-2 mb-4 md:mb-6 text-gray-900 border-b pb-2 border-gray-100">
        <Users className="w-4 h-4 md:w-5 md:h-5 text-blue-700" />
        트래픽 및 사용 패턴 설정
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
        {sliderConfigs.map((config, idx) => (
          <SliderInput key={idx} {...config} />
        ))}
      </div>
    </Card>
  );
};

/**
 * 슬라이더 입력 서브 컴포넌트
 */
const SliderInput = ({ label, value, setter, min, max, step, unit }) => (
  <div className="space-y-2 md:space-y-3">
    <label className="text-xs md:text-sm font-semibold text-gray-700 flex justify-between">
      {label}
      <span className="text-blue-700">{formatNumber(value)}{unit}</span>
    </label>
    <input 
      type="range" 
      min={min} 
      max={max} 
      step={step} 
      value={value} 
      onChange={(e) => setter(Number(e.target.value))} 
      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-700"
    />
  </div>
);

export default TrafficSettings;

