import { ClipboardCheck } from 'lucide-react';

/**
 * 토스트 알림 컴포넌트
 */
const Toast = ({ show, message }) => {
  if (!show) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-gray-900 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-300">
      <ClipboardCheck className="w-5 h-5 text-green-400" />
      <span className="font-bold text-sm">{message}</span>
    </div>
  );
};

export default Toast;

