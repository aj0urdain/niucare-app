"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function TestVerifyClaimPage() {
  return (
    <div className="container">
      <h1 className="text-2xl font-bold mb-6">Verify Claim Test</h1>

      <DropdownMenu>
        <DropdownMenuTrigger className="bg-white px-4 py-2 border rounded-md shadow-sm hover:bg-gray-50">
          Select an option
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Option 1</DropdownMenuItem>
          <DropdownMenuItem>Option 2</DropdownMenuItem>
          <DropdownMenuItem>Option 3</DropdownMenuItem>
          <DropdownMenuItem>Option 4</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="flex gap-4">
        {/* <TestVerifyClaimQuery /> */}
        {/* <TestBankDetailsQuery /> */}
      </div>
      <div>{/* <BankTest /> */}</div>
      <div className="flex gap-4 mx-auto">
        {/* <UseReducerTest /> */}
        {/* <ZustandTest /> */}
      </div>
    </div>
  );
}
