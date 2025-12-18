/**
 * 포맷팅 유틸리티 함수
 */

/**
 * 숫자를 USD 통화 형식으로 변환
 * @param {number} value - 변환할 숫자
 * @returns {string} 포맷된 통화 문자열 (예: $1,234.56)
 */
export const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD', 
    minimumFractionDigits: 2 
  }).format(value);
};

/**
 * 숫자를 천 단위 구분 기호가 있는 형식으로 변환
 * @param {number} value - 변환할 숫자
 * @returns {string} 포맷된 숫자 문자열 (예: 1,234)
 */
export const formatNumber = (value) => {
  return new Intl.NumberFormat('en-US').format(Math.round(value));
};

