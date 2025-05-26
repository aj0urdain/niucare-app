"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TrendingUp,
  CircleDashed,
  CircleCheckBig,
  CircleX,
  LayoutDashboard,
  AlertCircle,
  CornerDownRight,
} from "lucide-react";
import CountUp from "react-countup";
import { useQuery } from "@apollo/client";
import {
  GET_DASHBOARD_CLAIMS,
  GET_POLICYHOLDERCLAIMS,
} from "@/lib/graphql/queries";
import { DateRangeSelector } from "@/components/atoms/date-range-selector";
import { ClaimCard } from "@/components/molecules/claim-card";
import { Separator } from "@/components/ui/separator";
import { useUserProfileStore } from "@/stores/user-profile-store";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

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
  const { user } = useUserProfileStore();
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().setDate(new Date().getDate() - 7)),
    to: new Date(),
  });

  const isRegistrationAcknowledged =
    user?.registration?.status?.toLowerCase() === "acknowledged";

  useEffect(() => {
    if (user) {
      console.log(user.registration);
    }
  }, [user]);

  const { loading, data } = useQuery(GET_POLICYHOLDERCLAIMS, {
    variables: {
      userId: user?.permissions.canApproveRegistration ? "" : user?.userId,
      providerRegNumber: "",
      claimId: "",
      employeeNo: "",
      claimCode: "",
      status: "pending",
    },
    skip: !user?.userId,
  });

  const { loading: dashboardLoading, data: dashboardData } = useQuery(
    GET_DASHBOARD_CLAIMS,
    {
      variables: {
        userId: user?.permissions.canApproveRegistration ? "" : user?.userId,
        startDate: format(dateRange.from, "yyyy-MM-dd"),
        endDate: format(dateRange.to, "yyyy-MM-dd"),
      },
      skip: !user?.userId,
    }
  );

  console.log(dashboardData);

  const pendingClaims: PolicyHolderClaim[] =
    data?.policyHolderClaims?.slice(0, 5) || [];

  if (!isRegistrationAcknowledged) {
    return (
      <div className="flex flex-col gap-4 py-4 relative min-h-[600px]">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold flex items-center gap-1.5">
            <LayoutDashboard className="w-6 h-6" />
            Dashboard
          </div>
        </div>

        <div className="absolute inset-0 flex items-center justify-center z-10">
          <Card className="w-full max-w-xl shadow-lg">
            <CardHeader>
              <div className="flex items-start gap-3">
                <div className="space-y-1">
                  <CardTitle className="text-lg flex items-center gap-1.5">
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                    Complete Your Registration
                  </CardTitle>
                  <p className="text-base text-muted-foreground">
                    To access the dashboard and manage your claims, you&apos;ll
                    need to complete your registration process. This ensures we
                    have all the necessary information to provide you with the
                    best service.
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex justify-end pt-2">
              <Button asChild size="lg" className="gap-2">
                <Link
                  href="/registration"
                  className="flex items-center gap-2 group/link"
                >
                  <CornerDownRight className="w-4 h-4 group-hover/link:animate-shake-once" />
                  Go to Registration Page
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 opacity-30">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-32 mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>

        <Separator className="my-8" />

        <Card className="opacity-30">
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 py-4">
      <div className="flex items-center justify-between">
        <div className="text-2xl font-bold flex items-center gap-1.5">
          <LayoutDashboard className="w-6 h-6" />
          Dashboard
        </div>
        <DateRangeSelector onRangeChange={setDateRange} />
      </div>

      {/* <Card className="w-full h-[180px]">test</Card> */}

      {/* Stats Cards */}
      <div className="data-[slot=card]:*:shadow-2xs grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 data-[slot=card]:*:bg-linear-to-t data-[slot=card]:*:from-primary/5 data-[slot=card]:*:to-card dark:data-[slot=card]:*:bg-card">
        <Card className="@container/card transition-all duration-300 hover:bg-primary/5 hover:border-primary/20 max-h-48 overflow-hidden group/total-claims">
          <CardHeader className="relative">
            <div className="text-muted-foreground/75">
              <span className="text-xs font-semibold">Total Claims</span>
            </div>
            <CardTitle className="@[250px]/card:text-4xl text-3xl font-semibold tabular-nums transition-all duration-300 group-hover/total-claims:text-4xl">
              <CountUp
                end={dashboardData?.dashboardClaims?.totalClaims || 0}
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
                end={dashboardData?.dashboardClaims?.pendingClaims || 0}
                duration={2}
                className="text-yellow-500"
              />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1.5">
              <CircleDashed className="h-4 w-4 text-yellow-500" />
              <span className="text-xs text-muted-foreground">
                {dashboardData?.dashboardClaims?.pendingClaims} awaiting
                approval
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
                end={dashboardData?.dashboardClaims?.approvedClaims || 0}
                duration={2}
                className="text-green-500"
              />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1.5">
              <CircleCheckBig className="h-4 w-4 text-green-500" />
              <span className="text-xs text-muted-foreground">
                {dashboardData?.dashboardClaims?.approvedClaims} processed
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
                end={dashboardData?.dashboardClaims?.rejectedClaims || 0}
                duration={2}
                className="text-red-500"
              />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1.5">
              <CircleX className="h-4 w-4 text-red-500" />
              <span className="text-xs text-muted-foreground">
                {dashboardData?.dashboardClaims?.rejectedClaims} declined
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator className="my-8" />

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
