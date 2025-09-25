
'use client';
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

type RfpChecklistDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

const checklistData = [
  { criterion: 'Potential candidates for keys roles were present during the presentation. Experience and Technical Qualifications/Capabilities', weight: '10.0%' },
  { criterion: 'Proposed Programmatic Approach', weight: '10.0%' },
  { criterion: 'Commercial Excellence', weight: '10.0%' },
  { criterion: 'Innovative Solutions', weight: '10.0%' },
  { criterion: 'Mission Critical Experience/Data Center Experience', weight: '10.0%' },
  { criterion: 'NICON', weight: '10.0%' },
  { criterion: 'EHS', weight: '20.0%' },
  { criterion: 'GPO', weight: '5.0%' },
  { criterion: 'FEP/MARCUS PMO', weight: '5.0%' },
];

export function RfpChecklistDialog({ isOpen, onOpenChange }: RfpChecklistDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>RFP Evaluation Checklist Configuration</DialogTitle>
          <DialogDescription>
            Review and adjust the weighting for each evaluation criterion.
          </DialogDescription>
        </DialogHeader>
        <div className="overflow-y-auto max-h-[60vh]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Criterion</TableHead>
                <TableHead className="text-right w-32">Weighting</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {checklistData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.criterion}</TableCell>
                  <TableCell className="text-right">{item.weight}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => onOpenChange(false)}>Save Configuration</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
