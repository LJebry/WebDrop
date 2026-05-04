import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/Dialog";

type SendRequestDialogProps = {
  open: boolean;
  deviceName: string;
  onCancel: () => void;
};

export function SendRequestDialog({ open, deviceName, onCancel }: SendRequestDialogProps) {
  return (
    <Dialog open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sharing request sent</DialogTitle>
          <DialogDescription>Waiting for {deviceName} to accept your file.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
