import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Claim } from "@/components/atoms/columns-data";

interface ViewClaimModalProps {
  claim: Claim | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewClaimModal({
  claim,
  open,
  onOpenChange,
}: ViewClaimModalProps) {
  if (!claim) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Claim Details</DialogTitle>
          <DialogDescription>
            Claim ID <span className="font-semibold">{claim.claimId}</span>
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium text-muted-foreground">
                  Claim ID
                </TableCell>
                <TableCell>{claim.claimId}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium text-muted-foreground">
                  Employee Number
                </TableCell>
                <TableCell>{claim.employeeNumber}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium text-muted-foreground">
                  Claim Type
                </TableCell>
                <TableCell>{claim.claimType}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium text-muted-foreground">
                  Amount
                </TableCell>
                <TableCell>
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "PGK",
                  }).format(claim.amount)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium text-muted-foreground">
                  Description
                </TableCell>
                <TableCell>{claim.description}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium text-muted-foreground">
                  Status
                </TableCell>
                <TableCell className="capitalize">{claim.status}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
