"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, CircleDashed } from "lucide-react";
import CountUp from "react-countup";
import { ChartAreaInteractive } from "@/components/molecules/dashboard-chart";
import { useQuery } from "@apollo/client";
import { GET_POLICYHOLDERCLAIMS } from "@/lib/graphql/queries";
import { getCurrentUser } from "aws-amplify/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
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
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Stats Cards */}
      <div className="*:data-[slot=card]:shadow-xs grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card">
        <Card className="@container/card transition-all duration-300 hover:bg-primary/5">
          <CardHeader className="relative">
            <div className="text-muted-foreground/75">
              <span className="text-xs font-semibold">Total Claims</span>
            </div>
            <CardTitle className="@[250px]/card:text-4xl text-3xl font-semibold tabular-nums transition-all duration-300 hover:text-5xl">
              <CountUp
                end={stats.totalClaims}
                duration={2}
                className="text-primary"
              />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-xs text-muted-foreground">
                +12% from last month
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="@container/card transition-all duration-300 hover:bg-yellow-500/5">
          <CardHeader className="relative">
            <div className="text-muted-foreground/75">
              <span className="text-xs font-semibold">Pending Claims</span>
            </div>
            <CardTitle className="@[250px]/card:text-4xl text-3xl font-semibold tabular-nums transition-all duration-300 hover:text-5xl">
              <CountUp
                end={stats.pendingClaims}
                duration={2}
                className="text-yellow-500"
              />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CircleDashed className="h-4 w-4 text-yellow-500" />
              <span className="text-xs text-muted-foreground">
                {stats.pendingClaims} claims pending
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="@container/card transition-all duration-300 hover:bg-green-500/5">
          <CardHeader className="relative">
            <div className="text-muted-foreground/75">
              <span className="text-xs font-semibold">Approved Claims</span>
            </div>
            <CardTitle className="@[250px]/card:text-4xl text-3xl font-semibold tabular-nums transition-all duration-300 hover:text-5xl">
              <CountUp
                end={stats.approvedClaims}
                duration={2}
                className="text-green-500"
              />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-xs text-muted-foreground">
                +8% from last month
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="@container/card transition-all duration-300 hover:bg-blue-500/5">
          <CardHeader className="relative">
            <div className="text-muted-foreground/75">
              <span className="text-xs font-semibold">Rejected Claims</span>
            </div>
            <CardTitle className="@[250px]/card:text-4xl text-3xl font-semibold tabular-nums transition-all duration-300 hover:text-5xl">
              <CountUp
                end={stats.totalProviders}
                duration={2}
                className="text-red-500"
              />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-red-500" />
              <span className="text-xs text-muted-foreground">
                +5% from last month
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* <ChartAreaInteractive /> */}

      <div className="grid grid-cols-1 gap-4 w-full">
        <Card className="animate-slide-right-fade-in">
          <CardHeader>
            <CardTitle>Pending Claims</CardTitle>
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
                  <Card
                    key={claim.id}
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => router.push(`/claims?id=${claim.id}`)}
                  >
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className="bg-yellow-900/25 text-yellow-800 dark:text-yellow-400 border border-yellow-700/50"
                          >
                            Pending
                          </Badge>
                          <span className="font-medium text-sm">
                            ID: {claim.id}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">
                            Employee: {claim.employeeNo}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Type: {claim.label}
                          </p>
                          <p className="font-medium text-sm">
                            {new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: "PGK",
                            }).format(claim.amount)}
                          </p>
                        </div>
                        {claim.description && (
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {claim.description}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
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
