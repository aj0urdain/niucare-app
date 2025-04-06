"use client";

import { TestVerifyClaimQuery } from "@/components/atoms/test-verify-claim";
import { TestBankDetailsQuery } from "@/components/atoms/test-has-bank";
import UseReducerTest from "@/components/atoms/use-reducer-test";
import ZustandTest from "@/components/atoms/zustand-test";
import BankTest from "@/components/atoms/test-bank-add";
import { useEffect } from "react";

export default function TestVerifyClaimPage() {
  return (
    <div className="container">
      <h1 className="text-2xl font-bold mb-6">Verify Claim Test</h1>
      <div className="flex gap-4">
        {/* <TestVerifyClaimQuery /> */}
        {/* <TestBankDetailsQuery /> */}
      </div>
      <div>{/* <BankTest /> */}</div>
      <div className="flex gap-4 mx-auto">
        {/* <UseReducerTest /> */}
        {/* <ZustandTest /> */}
        <p>Darnell Bourne</p>
      </div>
    </div>
  );
}
