"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { DashboardAnalytics, Language } from "@/lib/types";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function generateCarbonInsights(
  data: DashboardAnalytics,
  language: Language = "ko",
): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const { summary, pcfBreakdown } = data;
  const pcfText = pcfBreakdown
    .map((p) => `${p.stage}: ${p.emissions}t (${p.percentage}%)`)
    .join(", ");

  const prompt = `
    You are a professional sustainability consultant. 
    Analyze the following carbon emission data for a company and provide 3-4 actionable insights.
    
    Data:
    - Monthly Total Emissions: ${summary.currentMonthTotal.toLocaleString()} tCO2eq
    - Month-over-Month Growth: ${summary.growthRate}%
    - Most Emitted Scope: ${summary.mostEmittedScope.scope} (${summary.mostEmittedScope.value.toLocaleString()} tCO2eq)
    - PCF Lifecycle Breakdown: ${pcfText}
    - Estimated Carbon Tax: ${summary.estimatedCarbonTax.toLocaleString()} KRW
    
    Requirements:
    1. Language: ${language === "ko" ? "Korean" : "English"}
    2. Format: Use Markdown. Use '###' for headers and '**' for highlighting key terms.
    3. Goal: Focus on reducing total emissions and minimizing the estimated carbon tax.
    4. Specificity: Be specific about the lifecycle stage that has the highest emissions.
    5. Tone: Professional, expert, and encouraging.
    
    Please provide the response directly in the requested language.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error(
      "AI 인사이트를 생성하는 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
    );
  }
}
