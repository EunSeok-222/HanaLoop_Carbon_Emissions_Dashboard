'use client';

import { useEffect, useState } from 'react';
import { fetchCompanies, updateCompany } from '@/lib/api';
import { Company, GhgEmission } from '@/lib/types';
import { useDashboardStore } from '@/hooks/use-dashboard-store';
import { translations } from '@/lib/translations';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit2, Building2, Globe2, AlertCircle, CheckCircle2, Loader2, Plus, Trash2, Calendar, Database, Info, BarChart3 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { classifyScope } from '@/utils/carbonCalculator';
import { cn } from '@/lib/utils';

const SOURCE_OPTIONS = [
  { value: 'gasoline', label: '가솔린 (Gasoline)' },
  { value: 'diesel', label: '디젤 (Diesel)' },
  { value: 'lng', label: 'LNG' },
  { value: 'gas', label: '가스 (Gas)' },
  { value: 'coal', label: '석탄 (Coal)' },
  { value: 'electricity', label: '전기 (Electricity)' },
  { value: 'steam', label: '스팀 (Steam)' },
  { value: 'etc', label: '기타 (Etc)' },
];

export default function CompaniesPage() {
  const { language } = useDashboardStore();
  const t = translations[language];

  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Basic Info Edit Modal State
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [editName, setEditName] = useState('');
  const [editCountry, setEditCountry] = useState('');
  
  // Emissions Manage Modal State
  const [managingEmissionsCompany, setManagingEmissionsCompany] = useState<Company | null>(null);
  const [editEmissions, setEditEmissions] = useState<GhgEmission[]>([]);
  
  const [isUpdating, setIsUpdating] = useState(false);

  const loadCompanies = async () => {
    setIsLoading(true);
    try {
      const data = await fetchCompanies();
      setCompanies(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.errorTitle);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  const handleEditClick = (company: Company) => {
    setEditingCompany(company);
    setEditName(company.name);
    setEditCountry(company.country);
  };

  const handleManageEmissionsClick = (company: Company) => {
    setManagingEmissionsCompany(company);
    setEditEmissions([...company.emissions]);
  };

  const handleUpdateBasicInfo = async () => {
    if (!editingCompany) return;
    setIsUpdating(true);
    try {
      await updateCompany(editingCompany.id, {
        name: editName,
        country: editCountry,
      });
      setSuccessMsg(t.updateSuccess);
      setEditingCompany(null);
      await loadCompanies();
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.updateError);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateEmissions = async () => {
    if (!managingEmissionsCompany) return;
    setIsUpdating(true);
    try {
      await updateCompany(managingEmissionsCompany.id, {
        emissions: editEmissions,
      });
      setSuccessMsg(t.updateSuccess);
      setManagingEmissionsCompany(null);
      await loadCompanies();
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.updateError);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddEmission = () => {
    const newEmission: GhgEmission = {
      yearMonth: new Date().toISOString().slice(0, 7),
      source: 'electricity',
      emissions: 0,
    };
    setEditEmissions([...editEmissions, newEmission]);
  };

  const handleRemoveEmission = (index: number) => {
    const newEmissions = [...editEmissions];
    newEmissions.splice(index, 1);
    setEditEmissions(newEmissions);
  };

  const handleEmissionChange = (index: number, field: keyof GhgEmission, value: any) => {
    const newEmissions = [...editEmissions];
    newEmissions[index] = { ...newEmissions[index], [field]: value };
    setEditEmissions(newEmissions);
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t.companyManagementTitle}</h1>
          <p className="text-muted-foreground mt-1">{t.companyManagementDesc}</p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t.errorTitle}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {successMsg && (
        <Alert className="border-emerald-500 bg-emerald-50 text-emerald-700 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{successMsg}</AlertDescription>
        </Alert>
      )}

      <Card className="border-none shadow-xl ring-1 ring-border/50 overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Building2 className="h-5 w-5 text-emerald-600" />
            {t.companies}
          </CardTitle>
          <CardDescription>
            {companies.length} 개의 기업이 등록되어 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-slate-50/30 border-b">
                <tr>
                  <th className="px-6 py-4 font-medium">{t.companyName}</th>
                  <th className="px-6 py-4 font-medium">{t.country}</th>
                  <th className="px-6 py-4 font-medium text-right">{t.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {isLoading ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-10 text-center text-muted-foreground">
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
                        <span>{t.loadingData}</span>
                      </div>
                    </td>
                  </tr>
                ) : companies.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-10 text-center text-muted-foreground">
                      등록된 기업이 없습니다.
                    </td>
                  </tr>
                ) : (
                  companies.map((company) => (
                    <tr key={company.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                            {company.name.charAt(0)}
                          </div>
                          <span className="font-semibold text-slate-900">{company.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2 text-slate-600 w-16">
                            <Globe2 className="h-4 w-4" />
                            {company.country}
                          </div>
                          <Button 
                            variant="outline" 
                            size="xs" 
                            className="h-7 text-xs border-emerald-200 text-emerald-700 hover:bg-emerald-50 gap-1.5 shadow-sm"
                            onClick={() => handleManageEmissionsClick(company)}
                          >
                            <BarChart3 className="h-3.5 w-3.5" />
                            {t.monthlyEmissions}
                          </Button>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="hover:bg-slate-100 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleEditClick(company)}
                        >
                          <Edit2 className="h-4 w-4 mr-2" />
                          {t.edit}
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Basic Info Edit Dialog */}
      <Dialog open={!!editingCompany} onOpenChange={(open) => !open && setEditingCompany(null)}>
        <div className="max-w-md w-full">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit2 className="h-5 w-5 text-emerald-600" />
              {t.edit} - {editingCompany?.name}
            </DialogTitle>
          </DialogHeader>
          <DialogContent className="p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">{t.companyName}</Label>
              <Input 
                id="companyName" 
                value={editName} 
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Enter company name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">{t.country}</Label>
              <Input 
                id="country" 
                value={editCountry} 
                onChange={(e) => setEditCountry(e.target.value)}
                placeholder="Enter country code (e.g. KR, US)"
              />
            </div>
          </DialogContent>
          <DialogFooter className="p-6 border-t bg-slate-50/30">
            <Button variant="outline" onClick={() => setEditingCompany(null)} disabled={isUpdating}>
              {t.cancel}
            </Button>
            <Button onClick={handleUpdateBasicInfo} disabled={isUpdating} className="bg-emerald-600 hover:bg-emerald-700">
              {isUpdating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {t.save}
            </Button>
          </DialogFooter>
        </div>
      </Dialog>

      {/* Emissions Manage Dialog */}
      <Dialog open={!!managingEmissionsCompany} onOpenChange={(open) => !open && setManagingEmissionsCompany(null)}>
        <div className="max-w-4xl w-full">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-emerald-600" />
              {t.monthlyEmissions} - {managingEmissionsCompany?.name}
            </DialogTitle>
          </DialogHeader>
          <DialogContent className="p-0 flex flex-col h-[500px]">
            <div className="px-6 py-4 flex justify-between items-center bg-slate-50/50 border-b">
              <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Database className="h-4 w-4" />
                {t.monthlyEmissions} ({editEmissions.length})
              </h3>
              <Button size="sm" variant="outline" className="h-8 text-emerald-600 border-emerald-200 hover:bg-emerald-50" onClick={handleAddEmission}>
                <Plus className="h-4 w-4 mr-1" />
                {t.addEntry}
              </Button>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              <table className="w-full text-sm text-left">
                <thead className="sticky top-0 bg-white border-b text-xs text-muted-foreground uppercase z-10">
                  <tr>
                    <th className="px-6 py-3 font-medium">{t.month}</th>
                    <th className="px-6 py-3 font-medium">{t.source}</th>
                    <th className="px-6 py-3 font-medium">{t.amount}</th>
                    <th className="px-6 py-3 font-medium">{t.scope}</th>
                    <th className="px-6 py-3 font-medium text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {editEmissions.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-10 text-center text-muted-foreground italic">
                        {t.noEmissions}
                      </td>
                    </tr>
                  ) : (
                    editEmissions.map((item, idx) => {
                      const currentScope = classifyScope(item.source);
                      return (
                        <tr key={idx} className="hover:bg-slate-50/30 transition-colors">
                          <td className="px-6 py-2">
                            <div className="relative">
                              <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input 
                                type="month"
                                value={item.yearMonth}
                                onChange={(e) => handleEmissionChange(idx, 'yearMonth', e.target.value)}
                                className="h-9 pl-9 w-40 bg-transparent border-none focus-visible:ring-1"
                              />
                            </div>
                          </td>
                          <td className="px-6 py-2">
                            <Select 
                              value={item.source} 
                              onValueChange={(val) => handleEmissionChange(idx, 'source', val)}
                            >
                              <SelectTrigger className="h-9 w-full bg-transparent border-none focus:ring-1">
                                <SelectValue placeholder="Select source" />
                              </SelectTrigger>
                              <SelectContent>
                                {SOURCE_OPTIONS.map((opt) => (
                                  <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="px-6 py-2">
                            <Input 
                              type="number"
                              value={item.emissions}
                              onChange={(e) => handleEmissionChange(idx, 'emissions', parseFloat(e.target.value) || 0)}
                              className="h-9 bg-transparent border-none focus-visible:ring-1 w-24"
                            />
                          </td>
                          <td className="px-6 py-2">
                            <span className={cn(
                              "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                              currentScope === 'Scope 1' ? "bg-amber-100 text-amber-700" :
                              currentScope === 'Scope 2' ? "bg-blue-100 text-blue-700" :
                              "bg-emerald-100 text-emerald-700"
                            )}>
                              {currentScope}
                            </span>
                          </td>
                          <td className="px-6 py-2 text-right">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-muted-foreground hover:text-destructive transition-colors"
                              onClick={() => handleRemoveEmission(idx)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </DialogContent>
          <DialogFooter className="p-6 border-t bg-slate-50/30">
            <Button variant="outline" onClick={() => setManagingEmissionsCompany(null)} disabled={isUpdating}>
              {t.cancel}
            </Button>
            <Button onClick={handleUpdateEmissions} disabled={isUpdating} className="bg-emerald-600 hover:bg-emerald-700 min-w-[100px]">
              {isUpdating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {t.save}
            </Button>
          </DialogFooter>
        </div>
      </Dialog>
    </div>
  );
}
