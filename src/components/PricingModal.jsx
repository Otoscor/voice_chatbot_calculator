import { DollarSign, X, Mic, Brain, Volume2 } from 'lucide-react';
import { PRICING_DATA } from '../constants/pricing';

/**
 * API 상세 가격표 모달 컴포넌트
 * STT, LLM, TTS 서비스별 가격 정보를 테이블 형태로 표시
 */
const PricingModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const sections = [
    {
      title: 'Speech to Text',
      icon: Mic,
      data: PRICING_DATA.stt,
      costLabel: '가격 (분당)',
      costKey: 'costPerMin'
    },
    {
      title: 'LLM',
      icon: Brain,
      data: PRICING_DATA.llm,
      costLabel: '입력/출력 (1M 토큰)',
      costKey: 'costInput'
    },
    {
      title: 'Text to Speech',
      icon: Volume2,
      data: PRICING_DATA.tts,
      costLabel: '가격 (1M 글자당)',
      costKey: 'costPer1MChar'
    }
  ];

  const renderCostCell = (item, costKey) => {
    if (costKey === 'costInput') {
      return `In $${item.costInput} / Out $${item.costOutput}`;
    }
    return `$${item[costKey]}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-200">
        {/* 헤더 */}
        <div className="p-4 md:p-5 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-lg md:text-xl font-bold text-gray-900 flex items-center gap-2">
            <DollarSign className="w-5 h-5 md:w-6 md:h-6 text-blue-700" />
            API 상세 가격표
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors text-gray-500"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 본문 */}
        <div className="p-4 md:p-6 space-y-6 md:space-y-8">
          {sections.map((section, idx) => (
            <section key={idx}>
              <h3 className="text-base md:text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                <section.icon className="w-4 h-4 md:w-5 md:h-5 text-blue-700" />
                {section.title}
              </h3>
              <div className="overflow-x-auto border-t-2 border-gray-800 rounded-sm">
                <table className="w-full text-xs md:text-sm text-left border-b border-gray-200 whitespace-nowrap md:whitespace-normal">
                  <thead className="bg-gray-50 text-gray-700 font-bold">
                    <tr>
                      <th className="p-2 md:p-3 border-b border-gray-200">모델명</th>
                      <th className="p-2 md:p-3 border-b border-gray-200">공급사</th>
                      <th className="p-2 md:p-3 border-b border-gray-200">{section.costLabel}</th>
                      <th className="p-2 md:p-3 border-b border-gray-200">출처</th>
                      <th className="p-2 md:p-3 border-b border-gray-200 hidden sm:table-cell">비고</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {section.data.map(item => (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-2 md:p-3 font-medium text-gray-900">
                          {item.name}
                          {item.isEstimate && (
                            <span className="ml-1 px-1 py-0.5 text-[8px] md:text-[9px] font-medium bg-amber-100 text-amber-700 rounded border border-amber-200">
                              추정
                            </span>
                          )}
                        </td>
                        <td className="p-2 md:p-3 text-gray-600">{item.provider}</td>
                        <td className="p-2 md:p-3 text-blue-700 font-bold">
                          {renderCostCell(item, section.costKey)}
                        </td>
                        <td className="p-2 md:p-3">
                          {item.officialSite && (
                            <a
                              href={item.officialSite}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:text-blue-700 transition-colors break-all underline"
                              aria-label={`${item.name} 공식 가격표`}
                            >
                              {item.officialSite}
                            </a>
                          )}
                        </td>
                        <td className="p-2 md:p-3 text-gray-500 hidden sm:table-cell">{item.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ))}

          {/* 푸터 안내 */}
          <div className="text-xs text-gray-500 mt-4 bg-gray-50 p-4 rounded border border-gray-200 leading-relaxed space-y-1">
            <p>* 모바일 환경에서는 일부 상세 정보가 생략될 수 있습니다.</p>
            <p>* <span className="px-1 py-0.5 text-[9px] font-medium bg-amber-100 text-amber-700 rounded border border-amber-200">추정</span> 표시된 가격은 공식 USD 가격이 미공개되어 시장 추정치로 산정되었습니다.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingModal;

