"use client";

import { useEffect, useState } from "react";
import { Claim, columns } from "@/components/atoms/columns-data";
import { DataTable } from "@/components/organisms/data-table";
import { Separator } from "@/components/ui/separator";

async function getData(): Promise<Claim[]> {
  // Fetch data from your API here.
  return [
    {
      id: "1",
      providerId: "REG-283877",
      claimId: "81",
      amount: 1222,
      status: "pending",
      claimType: "Post-Hospitalization",
      employeeNumber: "10300804",
      description: "Went to private clinic",
      viewFiles: "https://example.com/files/1234567890",
    },
    {
      id: "2",
      providerId: "REG-283984",
      claimId: "80",
      amount: 150,
      status: "rejected",
      claimType: "Optical",
      employeeNumber: "10022495",
      description: "eye test",
      viewFiles: "https://example.com/files/1234567890",
    },
    // Add more sample data following the pattern from the image
  ];
}

export default function AdminClaimsPage() {
  const [data, setData] = useState<Claim[]>([]);

  useEffect(() => {
    getData().then(setData);
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <DataTable columns={columns} data={data} newClaimButton={false} />
    </div>
  );
}
