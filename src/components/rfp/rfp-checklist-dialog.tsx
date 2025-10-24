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
import type { RFP } from '@/lib/types';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';

interface ChecklistItem {
  criterion: string;
  weight: number;
}

interface ChecklistDocument {
    id: string;
    items: ChecklistItem[];
}

type RfpChecklistDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  rfp: RFP;
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

const DEFAULT_CHECKLIST_ID = 'main';

export function RfpChecklistDialog({ isOpen, onOpenChange, rfp }: RfpChecklistDialogProps) {
  const [checklist, setChecklist] = useState<ChecklistItem[]>(initialChecklistData);
  const { toast } = useToast();
  const firestore = useFirestore();

  const checklistRef = useMemoFirebase(() => {
    if (!rfp.id) return null;
    return doc(firestore, 'rfps', rfp.id, 'evaluation_checklist', DEFAULT_CHECKLIST_ID);
  }, [firestore, rfp.id]);

  const { data: checklistDoc, isLoading: isChecklistLoading } = useDoc<ChecklistDocument>(checklistRef);

  useEffect(() => {
    if (isOpen) {
        if (checklistDoc) {
            if (checklistDoc.items && checklistDoc.items.length > 0) {
                setChecklist(checklistDoc.items);
            } else {
                 // If doc exists but is empty, populate it with the default
                setChecklist(initialChecklistData);
                if (checklistRef) {
                    setDoc(checklistRef, { items: initialChecklistData });
                }
            }
        } else if (!isChecklistLoading && checklistRef) {
            // If doc doesn't exist, create it with default data
            setChecklist(initialChecklistData);
            setDoc(checklistRef, { items: initialChecklistData });
        }
    }
  }, [isOpen, checklistDoc, isChecklistLoading, checklistRef]);


  const totalWeight = useMemo(() => {
    return checklist.reduce((sum, item) => sum + (item.weight || 0), 0);
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

  const handleSave = async () => {
    if (!isTotalValid) {
      toast({
        variant: "destructive",
        title: "Invalid Weighting",
        description: "Please reevaluate the weighting. The total must be 100%.",
      });
      return;
    }
    if (!checklistRef) return;

    try {
      await updateDoc(checklistRef, { items: checklist });
      toast({
        title: "Configuration Saved",
        description: "The RFP checklist weighting has been updated.",
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to save checklist to Firestore", error);
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: "Could not save the configuration. Please try again.",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>RFP Evaluation Checklist Configuration</DialogTitle>
          <DialogDescription>
            Review and adjust the weighting for each evaluation criterion for this RFP.
          </DialogDescription>
        </DialogHeader>

        {isChecklistLoading ? (
             <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        ) : (
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
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!isTotalValid || isChecklistLoading}>Save Configuration</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}