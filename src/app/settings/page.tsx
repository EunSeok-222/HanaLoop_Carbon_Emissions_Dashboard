'use client';

import { useDashboardStore } from "@/hooks/use-dashboard-store";
import { translations } from "@/lib/translations";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Globe, Languages } from "lucide-react";

export default function SettingsPage() {
  const { language, setLanguage } = useDashboardStore();
  const t = translations[language];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t.settingsTitle}</h1>
        <p className="text-muted-foreground mt-1">{t.settingsDesc}</p>
      </div>

      <div className="grid gap-6 max-w-2xl">
        <Card className="border-none shadow-md ring-1 ring-border/50">
          <CardHeader className="flex flex-row items-center gap-4 space-y-0">
            <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
              <Languages size={24} />
            </div>
            <div>
              <CardTitle>{t.langTitle}</CardTitle>
              <CardDescription>{t.langDesc}</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-6 border-t">
            <RadioGroup 
              value={language} 
              onValueChange={(val) => setLanguage(val as 'ko' | 'en')}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div>
                <RadioGroupItem
                  value="ko"
                  id="ko"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="ko"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-checked:border-emerald-500 [&:has([data-state=checked])]:border-emerald-500 cursor-pointer"
                >
                  <span className="text-lg font-bold mb-1">한국어</span>
                  <span className="text-xs text-muted-foreground">Korean</span>
                </Label>
              </div>

              <div>
                <RadioGroupItem
                  value="en"
                  id="en"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="en"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-checked:border-emerald-500 [&:has([data-state=checked])]:border-emerald-500 cursor-pointer"
                >
                  <span className="text-lg font-bold mb-1">English</span>
                  <span className="text-xs text-muted-foreground">영어</span>
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md ring-1 ring-border/50 opacity-60">
          <CardHeader className="flex flex-row items-center gap-4 space-y-0">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <Globe size={24} />
            </div>
            <div>
              <CardTitle>{t.currencyTitle}</CardTitle>
              <CardDescription>{t.currencyDesc}</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-6 border-t">
            <p className="text-sm text-muted-foreground italic">{t.comingSoon}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
