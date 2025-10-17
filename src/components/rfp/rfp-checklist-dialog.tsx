'use client';
import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

// Define the shape of a checklist item
interface ChecklistItem {
  criterion: string;
  weight: number;
}

type RfpChecklistDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

const initialChecklistData: ChecklistItem[] = [
  { criterion: 'Potential candidates for keys roles were present during the presentation. Experience and Technical Qualifications/Capabilities', weight: 10.0 },
  { criterion: 'Proposed Programmatic Approach', weight: 10.0 },
  { criterion: 'Commercial Excellence', weight: 10.0 },
  { criterion: 'Innovative Solutions', weight: 10.0 },
  { criterion: 'Mission Critical Experience/Data Center Experience', weight: 10.0 },
  { criterion: 'NICON', weight: 10.0 },
  { criterion: 'EHS', weight: 20.0 },
  { criterion: 'GPO', weight: 5.0 },
  { criterion: 'FEP/MARCUS PMO', weight: 5.0 },
];

const LOCAL_STORAGE_KEY = 'rfpChecklistConfig';

// Helper function to load and parse checklist from localStorage
function loadChecklistFromLocalStorage(): ChecklistItem[] {
  if (typeof window === 'undefined') {
    return initialChecklistData;
  }
  const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      // Validate and convert weights to numbers
      if (Array.isArray(parsed)) {
        return parsed.map(item => ({
          criterion: String(item.criterion || ''),
          weight: parseFloat(String(item.weight)) || 0,
        }));
      }
    } catch (error) {
      console.error("Failed to parse checklist from localStorage", error);
    }
  }
  return initialChecklistData;
}

export function RfpChecklistDialog({ isOpen, onOpenChange }: RfpChecklistDialogProps) {
  const [checklist, setChecklist] = useState<ChecklistItem[]>(loadChecklistFromLocalStorage);
  const { toast } = useToast();

  // Effect to reload from localStorage when the dialog is opened
  useEffect(() => {
    if (isOpen) {
      setChecklist(loadChecklistFromLocalStorage());
    }
  }, [isOpen]);

  const totalWeight = useMemo(() => {
    return checklist.reduce((sum: number, item: ChecklistItem) => sum + (item.weight || 0), 0);
  }, [checklist]);

  const isTotalValid = useMemo(() => Math.abs(totalWeight - 100) < 0.01, [totalWeight]);

  const handleWeightChange = useCallback((index: number, value: string) => {
    const newWeight = parseFloat(value);
    setChecklist(prevChecklist => {
      const newChecklist = [...prevChecklist];
      newChecklist[index] = {
        ...newChecklist[index],
        weight: isNaN(newWeight) ? 0 : newWeight,
      };
      return newChecklist;
    });
  }, []);

  const handleSave = () => {
    if (!isTotalValid) {
      toast({
        variant: "destructive",
        title: "Invalid Weighting",
        description: "Please reevaluate the weighting. The total must be 100%.",
      });
      return;
    }

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(checklist));
        toast({
          title: "Configuration Saved",
          description: "The RFP checklist weighting has been updated.",
        });
        onOpenChange(false);
      } catch (error) {
        console.error("Failed to save checklist to localStorage", error);
        toast({
          variant: "destructive",
          title: "Save Failed",
          description: "Could not save the configuration. Please try again.",
        });
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>RFP Evaluation Checklist Configuration</DialogTitle>
          <DialogDescription>
            Review and adjust the weighting for each evaluation criterion.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Alert variant={isTotalValid ? 'default' : 'destructive'} className={cn(isTotalValid && "bg-green-100 dark:bg-green-900 border-green-300 dark:border-green-700")}>
            <AlertDescription className="flex justify-between items-center">
              <span>Weighting must add up to 100%.</span>
              <span className={cn("font-bold", isTotalValid ? "text-green-800 dark:text-green-200" : "text-destructive")}>
                Total: {totalWeight.toFixed(1)}%
              </span>
            </AlertDescription>
          </Alert>
          <div className="overflow-y-auto max-h-[45vh] border rounded-md">
            <Table>
              <TableHeader className="sticky top-0 bg-muted/50">
                <TableRow>
                  <TableHead>Criterion</TableHead>
                  <TableHead className="text-right w-48">Weighting</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {checklist.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.criterion}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Input
                          type="number"
                          value={item.weight}
                          onChange={(e) => handleWeightChange(index, e.target.value)}
                          className="w-24 ml-auto text-right bg-background"
                          step="0.1"
                        />
                        <span className="text-muted-foreground">%</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!isTotalValid}>Save Configuration</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

