import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, ShieldCheck, Zap, Leaf } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-white">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-emerald-50 rounded-full blur-3xl opacity-60 animate-pulse" />
        <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] bg-blue-50 rounded-full blur-3xl opacity-50" />
      </div>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Leaf size={14} />
          <span>탄소 관리의 새로운 기준</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 animate-in fade-in slide-in-from-bottom-6 duration-1000">
          HanaLoop <span className="text-emerald-600">카본 대시보드</span>
        </h1>

        <p className="max-w-2xl text-xl text-slate-600 mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
          기업의 탄소 배출량을 실시간으로 분석하고, 정확한 GHG Scope 분류를 통해
          기후 변화 대응 전략을 수립하세요. 전문적인 데이터 시각화가 비즈니스의 통찰력을 더합니다.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
          <Link href="/dashboard">
            <Button size="lg" className="h-14 px-10 text-lg bg-emerald-600 hover:bg-emerald-700 rounded-full shadow-xl shadow-emerald-200 transition-all hover:scale-105 gap-2 group">
              대시보드 시작하기
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Button variant="outline" size="lg" className="h-14 px-10 text-lg rounded-full border-slate-200 text-slate-600 hover:bg-slate-50">
            솔루션 소개
          </Button>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 max-w-5xl w-full animate-in fade-in duration-1000 delay-500">
          <div className="p-8 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow text-left">
            <div className="h-12 w-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
              <BarChart3 size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-3">정밀 분석 통계</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              월별 배출 트렌드와 Scope별 비중을 직관적인 차트로 한눈에 파악합니다.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow text-left">
            <div className="h-12 w-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-3">자동 GHG 분류</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              배출원 정보를 바탕으로 Scope 1, 2, 3를 자동으로 분류하여 정확도를 높입니다.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow text-left">
            <div className="h-12 w-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mb-6">
              <Zap size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-3">실시간 모니터링</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              변화하는 배출량 데이터를 실시간으로 감지하고 대시보드에 즉시 반영합니다.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 text-center border-t border-slate-50">
        <p className="text-slate-400 text-sm">
          © 2026 HanaLoop Inc. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
