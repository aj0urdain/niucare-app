"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TrendingUp,
  CircleDashed,
  CircleCheckBig,
  CircleX,
  LayoutDashboard,
} from "lucide-react";
import CountUp from "react-countup";
import { useQuery } from "@apollo/client";
import { GET_POLICYHOLDERCLAIMS } from "@/lib/graphql/queries";
import { getCurrentUser } from "aws-amplify/auth";
import { useEffect, useState } from "react";
import { ClaimCard } from "@/components/molecules/claim-card";

interface PolicyHolderClaim {
  id: number;
  amount: number;
  status: string;
  label: string;
  employeeNo: string;
  description: string;
  documents?: string;
}

export default function DashboardPage() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUserId = async () => {
      try {
        const { userId } = await getCurrentUser();
        setUserId(userId);
      } catch (error) {
        console.error("Error getting user ID:", error);
      }
    };
    getUserId();
  }, []);

  const { loading, data } = useQuery(GET_POLICYHOLDERCLAIMS, {
    variables: {
      userId: userId || "",
      providerRegNumber: "",
      claimId: "",
      employeeNo: "",
      claimCode: "",
      status: "pending",
    },
    skip: !userId,
  });

  const pendingClaims: PolicyHolderClaim[] =
    data?.policyHolderClaims?.slice(0, 5) || [];

  // Sample data - replace with actual data fetching
  const stats = {
    totalClaims: 1234,
    pendingClaims: pendingClaims.length,
    approvedClaims: 1178,
    totalProviders: 89,
  };

  return (
    <div className="flex flex-col gap-4 py-4">
      <div className="text-2xl font-bold flex items-center gap-1.5">
        <LayoutDashboard className="w-6 h-6" />
        Dashboard
      </div>

      {/* Stats Cards */}
      <div className="*:data-[slot=card]:shadow-xs grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card">
        <Card className="@container/card transition-all duration-300 hover:bg-primary/5 hover:border-primary/20 max-h-48 overflow-hidden group/total-claims">
          <CardHeader className="relative">
            <div className="text-muted-foreground/75">
              <span className="text-xs font-semibold">Total Claims</span>
            </div>
            <CardTitle className="@[250px]/card:text-4xl text-3xl font-semibold tabular-nums transition-all duration-300 group-hover/total-claims:text-4xl">
              <CountUp
                end={stats.totalClaims}
                duration={2}
                className="text-primary"
              />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-xs text-muted-foreground">
                +12% from last month
              </span>
            </div>
          </CardContent>
        </Card>
        <Card className="@container/card transition-all duration-300 hover:bg-yellow-500/5 hover:border-yellow-500/20 max-h-48 overflow-hidden group/pending-claims">
          <CardHeader className="relative">
            <div className="text-muted-foreground/75">
              <span className="text-xs font-semibold">Pending Claims</span>
            </div>
            <CardTitle className="@[250px]/card:text-4xl text-3xl font-semibold tabular-nums transition-all duration-300 group-hover/pending-claims:text-4xl">
              <CountUp
                end={stats.pendingClaims}
                duration={2}
                className="text-yellow-500"
              />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1.5">
              <CircleDashed className="h-4 w-4 text-yellow-500" />
              <span className="text-xs text-muted-foreground">
                {stats.pendingClaims} awaiting approval
              </span>
            </div>
          </CardContent>
        </Card>
        <Card className="@container/card transition-all duration-300 hover:bg-green-500/5 hover:border-green-500/20 max-h-48 overflow-hidden group/approved-claims">
          <CardHeader className="relative">
            <div className="text-muted-foreground/75">
              <span className="text-xs font-semibold">Approved Claims</span>
            </div>
            <CardTitle className="@[250px]/card:text-4xl text-3xl font-semibold tabular-nums transition-all duration-300 group-hover/approved-claims:text-4xl">
              <CountUp
                end={stats.approvedClaims}
                duration={2}
                className="text-green-500"
              />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1.5">
              <CircleCheckBig className="h-4 w-4 text-green-500" />
              <span className="text-xs text-muted-foreground">
                {stats.approvedClaims} processed
              </span>
            </div>
          </CardContent>
        </Card>
        <Card className="@container/card transition-all duration-300 hover:bg-red-500/5 hover:border-red-500/20 max-h-48 overflow-hidden group/rejected-claims">
          <CardHeader className="relative">
            <div className="text-muted-foreground/75">
              <span className="text-xs font-semibold">Rejected Claims</span>
            </div>
            <CardTitle className="@[250px]/card:text-4xl text-3xl font-semibold tabular-nums transition-all duration-300 group-hover/rejected-claims:text-4xl">
              <CountUp
                end={stats.totalProviders}
                duration={2}
                className="text-red-500"
              />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1.5">
              <CircleX className="h-4 w-4 text-red-500" />
              <span className="text-xs text-muted-foreground">
                {stats.totalProviders} declined
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 w-full h-full">
        <Card className="animate-slide-right-fade-in h-full group/pending-claims">
          <CardHeader>
            <CardTitle className="text-lg text-muted-foreground flex items-center gap-1.5">
              <CircleDashed className="w-4 h-4 group-hover/pending-claims:animate-spin-slow" />
              Pending Claims
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-24">
                <div className="flex items-center gap-2">
                  <CircleDashed className="h-4 w-4 animate-spin" />
                  <span>Loading claims...</span>
                </div>
              </div>
            ) : pendingClaims.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {pendingClaims.map((claim) => (
                  <ClaimCard key={claim.id} claim={claim} />
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-24 text-muted-foreground">
                No pending claims found.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
