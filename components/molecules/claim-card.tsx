"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { IdCard, Paperclip, CircleDashed } from "lucide-react";
import CountUp from "react-countup";

interface PolicyHolderClaim {
  id: number;
  amount: number;
  status: string;
  label: string;
  employeeNo: string;
  description: string;
}

interface ClaimCardProps {
  claim: PolicyHolderClaim;
}

export function ClaimCard({ claim }: ClaimCardProps) {
  const router = useRouter();
  const numDocuments = Math.floor(Math.random() * 3) + 1; // Random number between 1 and 3

  return (
    <Card
      className="cursor-pointer min-h-60 flex flex-col justify-between h-full bg-yellow-500/5 hover:bg-yellow-500/10 transition-all duration-300 group/claim-card hover:shadow-lg hover:shadow-yellow-500/20 hover:border-yellow-500/20 hover:-translate-y-2 relative"
      onClick={() => router.push(`/claims?id=${claim.id}`)}
    >
      <CircleDashed className="absolute top-4 right-4 w-20 h-20 text-muted-foreground/5 group-hover/claim-card:animate-spin-slow" />
      <CardHeader className="p-4">
        <CardTitle className="text-xs text-muted-foreground/50 flex items-center justify-between gap-1.5">
          <div className="flex items-center gap-1">
            <IdCard className="w-4 h-4" />
            <p className="text-xs">
              <CountUp
                start={0}
                end={parseInt(claim.employeeNo)}
                duration={2}
                separator=""
                className=""
              />
            </p>
          </div>
          <div className="flex items-center gap-1">
            <p className="text-[0.5rem] flex items-center gap-0.5">
              # <span className="font-semibold text-xs">{claim.id}</span>
            </p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 flex flex-col gap-2 items-start justify-between h-full">
        <div className="space-y-2">
          <div className="space-y-2">
            <p className="text-muted-foreground font-semibold flex items-center gap-1 line-clamp-1">
              {/* <Component className="w-4 h-4" /> */}
              {claim.label}
            </p>
            {claim.description && (
              <div className="flex flex-col">
                <p className="text-[0.7rem] text-muted-foreground/75">
                  Description
                </p>
                <p className="text-xs text-muted-foreground line-clamp-2 capitalize">
                  {claim.description}
                </p>
              </div>
            )}
            <div className="flex items-start flex-col gap-1 text-muted-foreground">
              <p className="text-[0.7rem] text-muted-foreground/75">
                {numDocuments} {numDocuments === 1 ? "Document" : "Documents"}
              </p>
              <div className="flex items-center gap-1">
                {Array.from({ length: numDocuments }).map((_, index) => (
                  <Paperclip key={index} className="w-3 h-3" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      {/* <Separator className="my-2" /> */}
      <CardFooter className="px-4">
        <CountUp
          start={0}
          end={claim.amount}
          duration={2}
          separator=""
          decimals={2}
          prefix="PGK "
          className="font-semibold text-xl text-muted-foreground transition-all duration-300 group-hover/claim-card:text-foreground"
        />
      </CardFooter>
    </Card>
  );
}
