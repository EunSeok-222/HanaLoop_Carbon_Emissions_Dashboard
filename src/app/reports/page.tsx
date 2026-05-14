'use client';

import { useState, useEffect, useMemo } from 'react';
import { fetchPosts, fetchCompanies } from '@/lib/api';
import { Post, Company } from '@/lib/types';
import { useDashboardStore } from '@/hooks/use-dashboard-store';
import { translations } from '@/lib/translations';
import { 
  FileText, 
  Search, 
  Filter, 
  Calendar, 
  ChevronRight, 
  Sparkles,
  ArrowUpDown
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

export default function ReportsPage() {
  const { language } = useDashboardStore();
  const t = translations[language];

  const [posts, setPosts] = useState<Post[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCompanyId, setSelectedCompanyId] = useState("all");
  
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [postsData, companiesData] = await Promise.all([
          fetchPosts(),
          fetchCompanies()
        ]);
        setPosts(postsData);
        setCompanies(companiesData);
      } catch (error) {
        console.error("Failed to load reports data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleOpenDialog = (post: Post) => {
    setSelectedPost(post);
    setIsDialogOpen(true);
  };

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           post.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCompany = selectedCompanyId === "all" || post.resourceUid === selectedCompanyId;
      return matchesSearch && matchesCompany;
    }).sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());
  }, [posts, searchQuery, selectedCompanyId]);

  const getCompanyName = (uid: string) => {
    if (uid === "all") return t.allCompanies;
    const company = companies.find(c => c.id === uid);
    return company ? company.name : uid;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">{t.reports}</h1>
        <p className="text-muted-foreground mt-1">
          {language === 'ko' ? '저장된 모든 탄소 배출 분석 리포트와 AI 인사이트를 관리합니다.' : 'Manage all saved carbon emission analysis reports and AI insights.'}
        </p>
      </header>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card p-4 rounded-xl border shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder={language === 'ko' ? '리포트 검색...' : 'Search reports...'} 
            className="pl-10 bg-background"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Filter className="h-4 w-4 text-muted-foreground hidden sm:block" />
          <Select value={selectedCompanyId} onValueChange={setSelectedCompanyId}>
            <SelectTrigger className="w-full md:w-[200px] bg-background">
              <SelectValue placeholder={t.companySelect}>
                {getCompanyName(selectedCompanyId)}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.allCompanies}</SelectItem>
              {companies.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Reports Grid */}
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="h-40 animate-pulse bg-muted" />
          ))}
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed rounded-2xl bg-card/50">
          <FileText className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
          <p className="text-lg font-medium text-slate-500">
            {language === 'ko' ? '검색 결과와 일치하는 리포트가 없습니다.' : 'No reports found matching your search.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post) => (
            <Card 
              key={post.id}
              onClick={() => handleOpenDialog(post)}
              className="group hover:ring-2 hover:ring-emerald-500/50 transition-all cursor-pointer overflow-hidden bg-card"
            >
              <CardContent className="p-0">
                <div className="p-5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className={cn(
                      "p-2 rounded-lg",
                      post.title.includes("AI") ? "bg-emerald-100 text-emerald-600" : "bg-blue-100 text-blue-600"
                    )}>
                      {post.title.includes("AI") ? <Sparkles size={20} /> : <FileText size={20} />}
                    </div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                      <Calendar size={12} />
                      {new Date(post.dateTime).toLocaleDateString(language === 'ko' ? 'ko-KR' : 'en-US')}
                    </span>
                  </div>
                  
                  <div>
                    <h3 className="font-bold text-slate-800 line-clamp-1 group-hover:text-emerald-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-xs font-medium text-slate-500 mt-1 flex items-center gap-1">
                      <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
                      {getCompanyName(post.resourceUid)}
                    </p>
                  </div>

                  <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                    {post.content.replace(/###/g, '').replace(/\*\*/g, '')}
                  </p>

                  <div className="pt-2 flex items-center text-xs font-bold text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    {language === 'ko' ? '자세히 보기' : 'View Details'}
                    <ChevronRight size={14} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Report Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {selectedPost && (
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader className="border-b pb-4 mb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className={cn(
                  "p-2 rounded-lg",
                  selectedPost.title.includes("AI") ? "bg-emerald-100 text-emerald-600" : "bg-blue-100 text-blue-600"
                )}>
                  {selectedPost.title.includes("AI") ? <Sparkles size={18} /> : <FileText size={18} />}
                </div>
                <div>
                  <DialogTitle className="text-2xl font-bold">{selectedPost.title}</DialogTitle>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                    <span className="font-semibold text-emerald-600">{getCompanyName(selectedPost.resourceUid)}</span>
                    <span>•</span>
                    <span>{new Date(selectedPost.dateTime).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </DialogHeader>
            
            <div className="prose prose-slate max-w-none">
              <div className="whitespace-pre-wrap text-slate-700 leading-relaxed">
                {selectedPost.content.split('\n').map((line, i) => (
                  <p key={i} className={cn(
                    line.startsWith('###') ? "text-xl font-bold text-slate-900 mt-6 mb-3 border-l-4 border-emerald-500 pl-3" : "",
                    line.startsWith('**') ? "font-bold text-emerald-700" : "",
                    "mb-2"
                  )}>
                    {line.replace(/###/g, '').replace(/\*\*/g, '')}
                  </p>
                ))}
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
