"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { InfoIcon as InfoCircle } from "lucide-react";

interface Claim {
  id: number;
  employeeNumber: string;
  claim: string;
  amount: number;
  description: string;
  status: "Approved" | "Rejected";
}

const claims: Claim[] = [
  {
    id: 80,
    employeeNumber: "10022495",
    claim: "Optical",
    amount: 150,
    description: "eye test",
    status: "Rejected",
  },
  {
    id: 78,
    employeeNumber: "00726281",
    claim: "Post-Hospitalization",
    amount: 250,
    description: "testing",
    status: "Rejected",
  },
  {
    id: 77,
    employeeNumber: "10180387",
    claim: "Dental Services",
    amount: 200,
    description: "",
    status: "Approved",
  },
];

export function ClaimsTable() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Claim Id</TableHead>
            <TableHead>Employee Number</TableHead>
            <TableHead>Claim</TableHead>
            <TableHead>Amount (PGK)</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>View Files</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {claims.map((claim) => (
            <TableRow key={claim.id}>
              <TableCell>{claim.id}</TableCell>
              <TableCell>{claim.employeeNumber}</TableCell>
              <TableCell>{claim.claim}</TableCell>
              <TableCell>{claim.amount}</TableCell>
              <TableCell>{claim.description}</TableCell>
              <TableCell className="flex items-center gap-2">
                {claim.status}
                {claim.status === "Rejected" && (
                  <InfoCircle className="h-4 w-4 text-blue-500" />
                )}
              </TableCell>
              <TableCell>
                <Button variant="secondary" size="sm">
                  VIEW FILES
                </Button>
              </TableCell>
              <TableCell>
                <Button
                  variant={
                    claim.status === "Approved" ? "secondary" : "default"
                  }
                  size="sm"
                >
                  DELETE
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
