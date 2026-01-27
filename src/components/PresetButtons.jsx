import { PRESETS } from '../constants/pricing';

/**
 * 프리셋 버튼 그룹 컴포넌트
 */
const PresetButtons = ({ onApplyPreset }) => (
  <div className="flex justify-end gap-2 mb-4 md:mb-6 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
    {Object.entries(PRESETS).map(([key, preset]) => (
      <button
        key={key}
        onClick={() => onApplyPreset(key)}
        className="flex-shrink-0 px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm bg-white border border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-700 rounded-md transition-colors shadow-sm font-medium whitespace-nowrap"
      >
        {preset.name}
      </button>
    ))}
  </div>
);

export default PresetButtons;

