"use client";

import { TestVerifyClaimQuery } from "@/components/atoms/test-verify-claim";
import { TestBankDetailsQuery } from "@/components/atoms/test-has-bank";
export default function TestVerifyClaimPage() {
  return (
    <div className="container">
      <h1 className="text-2xl font-bold mb-6">Verify Claim Test</h1>
      <div className="flex gap-4">
        <TestVerifyClaimQuery />
        <TestBankDetailsQuery />
      </div>
    </div>
  );
}
