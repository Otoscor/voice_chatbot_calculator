/**
 * 재사용 가능한 카드 컴포넌트
 * KRDS 스타일의 기본 카드 UI
 */
const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-lg border border-gray-300 shadow-sm ${className}`}>
    {children}
  </div>
);

export default Card;

