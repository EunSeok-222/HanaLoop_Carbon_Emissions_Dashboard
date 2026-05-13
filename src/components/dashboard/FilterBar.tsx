'use client';

import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useDashboardStore } from "@/hooks/use-dashboard-store";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

export default function FilterBar() {
  const { filter, setFilter } = useDashboardStore();

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-end sm:items-center justify-between bg-card p-4 rounded-xl border">
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Data Source</label>
        <Select value={filter || 'all'} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px] h-9">
            <SelectValue placeholder="Select Source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sources</SelectItem>
            <SelectItem value="src-a">Source Alpha</SelectItem>
            <SelectItem value="src-b">Source Beta</SelectItem>
            <SelectItem value="src-c">Source Gamma</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2">
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-9 px-2 text-muted-foreground"
          onClick={() => setFilter('all')}
        >
          <RefreshCcw className="h-3.5 w-3.5 mr-2" />
          Reset
        </Button>
        <Button size="sm" className="h-9 px-4">
          Export CSV
        </Button>
      </div>
    </div>
  );
}
