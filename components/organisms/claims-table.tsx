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
import { Claim } from "@/lib/graphql/types";

const claims: Claim[] = [
  {
    id: 80,
    policyholderId: 1,
    employeeNo: "10022495",
    label: "Optical",
    amount: 150,
    description: "eye test",
    status: "Rejected",
  },
  {
    id: 78,
    policyholderId: 2,
    employeeNo: "00726281",
    label: "Post-Hospitalization",
    amount: 250,
    description: "testing",
    status: "Rejected",
  },
  {
    id: 77,
    policyholderId: 3,
    employeeNo: "10180387",
    label: "Dental Services",
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
            <TableHead>Files</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {claims.map((claim) => (
            <TableRow key={claim.id}>
              <TableCell>{claim.id}</TableCell>
              <TableCell>{claim.employeeNo}</TableCell>
              <TableCell>{claim.label}</TableCell>
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
                  Files
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
