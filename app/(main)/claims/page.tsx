import { Claim, columns } from "@/components/atoms/columns-data";
import { DataTable } from "@/components/organisms/data-table";
import { NewClaimModal } from "@/components/organisms/new-claim-modal";
import { Separator } from "@/components/ui/separator";

import React from "react";

async function getData(): Promise<Claim[]> {
  // Fetch data from your API here.
  return [
    {
      id: "1",
      claimId: "80",
      amount: 150,
      status: "pending",
      claimType: "Optical",
      employeeNumber: "10022495",
      description: "Eye Test",
      viewFiles: "https://example.com/files/1234567890",
    },
    {
      id: "2",
      claimId: "78",
      amount: 250,
      status: "rejected",
      claimType: "Post-Hospitalization",
      employeeNumber: "00726281",
      description: "Patient after care",
      viewFiles: "https://example.com/files/1234567890",
    },
    {
      id: "3",
      claimId: "77",
      amount: 200,
      status: "approved",
      claimType: "Dental Services",
      employeeNumber: "10180387",
      description: "Dental checkup",
      viewFiles: "https://example.com/files/1234567890",
    },
    // ...
  ];
}

const Claims = async () => {
  const data = await getData();
  return (
    <div className="flex flex-col gap-6 pt-6">
      <div className="flex flex-col justify-start items-start gap-2">
        <h2 className="text-3xl font-bold">Claims</h2>
        {/* <NewClaimModal /> */}
      </div>
      <Separator />
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default Claims;
