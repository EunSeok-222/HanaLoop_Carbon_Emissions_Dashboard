'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

/**
 * 대시보드 에러 경계 (Error Boundary)
 * Next.js 16+ 에서는 reset 대신 unstable_retry를 사용합니다.
 */
export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    // 에러 로깅 서비스에 기록할 수 있습니다.
    console.error('Dashboard Error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center animate-in zoom-in duration-300">
      <div className="bg-destructive/10 p-4 rounded-full mb-6">
        <AlertCircle className="h-12 w-12 text-destructive" />
      </div>
      <h2 className="text-2xl font-bold mb-2">문제가 발생했습니다</h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        {error.message || '데이터를 가져오는 중 예상치 못한 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.'}
      </p>
      <div className="flex gap-4">
        <Button
          variant="outline"
          onClick={() => window.location.reload()}
        >
          페이지 새로고침
        </Button>
        <Button
          onClick={() => unstable_retry()}
        >
          다시 시도하기
        </Button>
      </div>
    </div>
  );
}
