import { useMemo } from 'react';
import { CALCULATION_CONSTANTS } from '../constants/pricing';

/**
 * 음성 챗봇 비용 계산 커스텀 훅
 * @param {Object} params - 계산 파라미터
 * @param {number} params.dau - 일간 활성 사용자 수
 * @param {number} params.turnsPerSession - 세션당 대화 턴 수
 * @param {number} params.avgUserAudioSec - 평균 사용자 음성 길이 (초)
 * @param {number} params.avgInputTokens - 평균 입력 토큰 수
 * @param {number} params.avgOutputTokens - 평균 출력 토큰 수
 * @param {Object} params.selectedSTT - 선택된 STT 모델
 * @param {Object} params.selectedLLM - 선택된 LLM 모델
 * @param {Object} params.selectedTTS - 선택된 TTS 모델
 * @returns {Object} 계산된 비용 및 리소스 사용량
 */
export const useCalculation = ({
  dau,
  turnsPerSession,
  avgUserAudioSec,
  avgInputTokens,
  avgOutputTokens,
  selectedSTT,
  selectedLLM,
  selectedTTS
}) => {
  const { DAYS_IN_MONTH, CHARS_PER_TOKEN } = CALCULATION_CONSTANTS;

  return useMemo(() => {
    // STT 비용 계산
    const dailyAudioMinutes = (dau * turnsPerSession * avgUserAudioSec) / 60;
    const monthlyAudioMinutes = dailyAudioMinutes * DAYS_IN_MONTH;
    const sttCost = monthlyAudioMinutes * selectedSTT.costPerMin;

    // LLM 비용 계산
    const dailyInputTokens = dau * turnsPerSession * avgInputTokens;
    const dailyOutputTokens = dau * turnsPerSession * avgOutputTokens;
    const monthlyInputMillions = (dailyInputTokens * DAYS_IN_MONTH) / 1_000_000;
    const monthlyOutputMillions = (dailyOutputTokens * DAYS_IN_MONTH) / 1_000_000;
    const llmInputCost = monthlyInputMillions * selectedLLM.costInput;
    const llmOutputCost = monthlyOutputMillions * selectedLLM.costOutput;
    const llmCost = llmInputCost + llmOutputCost;

    // TTS 비용 계산
    const dailyChars = dailyOutputTokens * CHARS_PER_TOKEN;
    const monthlyCharMillions = (dailyChars * DAYS_IN_MONTH) / 1_000_000;
    const ttsCost = monthlyCharMillions * selectedTTS.costPer1MChar;

    // 총 비용
    const totalMonthlyCost = sttCost + llmCost + ttsCost;

    return {
      monthly: { 
        total: totalMonthlyCost, 
        stt: sttCost, 
        llm: llmCost, 
        tts: ttsCost 
      },
      volume: { 
        minutes: monthlyAudioMinutes, 
        tokens: (monthlyInputMillions + monthlyOutputMillions) * 1_000_000, 
        chars: monthlyCharMillions * 1_000_000 
      },
      perUser: totalMonthlyCost / dau
    };
  }, [
    dau, 
    turnsPerSession, 
    avgUserAudioSec, 
    avgInputTokens, 
    avgOutputTokens, 
    selectedSTT, 
    selectedLLM, 
    selectedTTS,
    DAYS_IN_MONTH,
    CHARS_PER_TOKEN
  ]);
};

