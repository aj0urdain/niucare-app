"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronsDown } from "lucide-react";
import CountUp from "react-countup";

export default function DashboardPage() {
  // Sample data - replace with actual data fetching
  const stats = {
    totalClaims: 1234,
    pendingClaims: 56,
    approvedClaims: 1178,
    totalProviders: 89,
  };

  const recentClaims = [
    {
      id: "CL001",
      employee: "John Doe",
      type: "In-Patient Treatment",
      amount: 1500,
      status: "Pending",
    },
    {
      id: "CL002",
      employee: "Jane Smith",
      type: "Dental Services",
      amount: 300,
      status: "Approved",
    },
    {
      id: "CL003",
      employee: "Bob Johnson",
      type: "Optical",
      amount: 200,
      status: "Rejected",
    },
    {
      id: "CL004",
      employee: "Alice Brown",
      type: "General Practitioner Consultation",
      amount: 100,
      status: "Approved",
    },
  ];

  const providerRegistrations = [
    {
      id: "REG001",
      name: "City Hospital",
      type: "Private",
      province: "Central",
      status: "Pending",
    },
    {
      id: "REG002",
      name: "Rural Health Center",
      type: "Public",
      province: "Eastern Highlands",
      status: "Approved",
    },
    {
      id: "REG003",
      name: "Dental Clinic",
      type: "Private",
      province: "Morobe",
      status: "Pending",
    },
    {
      id: "REG004",
      name: "Community Health Post",
      type: "Public",
      province: "West New Britain",
      status: "Rejected",
    },
  ];

  return (
    <div className="flex flex-col gap-4 py-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="animate-slide-left-fade-in">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-normal">Total Claims</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <CountUp
                end={stats.totalClaims}
                duration={2}
                delay={0}
                useEasing
                smartEasingAmount={0.1}
                easingFn={(t, b, c, d) => {
                  // Quartic easing in/out
                  t /= d / 2;
                  if (t < 1) return (c / 2) * t * t * t * t + b;
                  t -= 2;
                  return (-c / 2) * (t * t * t * t - 2) + b;
                }}
              />
            </div>
            <div className="flex items-center gap-0.5">
              <ChevronsDown className="w-3 h-3 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">
                20.1% from last month
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="animate-slide-top-fade-in">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Claims
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold animate-slide-top-fade-in">
              <CountUp
                end={stats.pendingClaims}
                duration={2}
                delay={0}
                useEasing
                smartEasingAmount={0.1}
                easingFn={(t, b, c, d) => {
                  // Quartic easing in/out
                  t /= d / 2;
                  if (t < 1) return (c / 2) * t * t * t * t + b;
                  t -= 2;
                  return (-c / 2) * (t * t * t * t - 2) + b;
                }}
              />
            </div>
          </CardContent>
        </Card>
        <Card className="animate-slide-right-fade-in">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Approved Claims
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <CountUp
                end={stats.approvedClaims}
                duration={2}
                delay={0}
                useEasing
                smartEasingAmount={0.1}
                easingFn={(t, b, c, d) => {
                  // Quartic easing in/out
                  t /= d / 2;
                  if (t < 1) return (c / 2) * t * t * t * t + b;
                  t -= 2;
                  return (-c / 2) * (t * t * t * t - 2) + b;
                }}
              />
            </div>
          </CardContent>
        </Card>
        <Card className="animate-slide-bottom-fade-in">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Providers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <CountUp
                end={stats.totalProviders}
                duration={2}
                delay={0}
                useEasing
                smartEasingAmount={0.1}
                easingFn={(t, b, c, d) => {
                  // Quartic easing in/out
                  t /= d / 2;
                  if (t < 1) return (c / 2) * t * t * t * t + b;
                  t -= 2;
                  return (-c / 2) * (t * t * t * t - 2) + b;
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Claims Overview and Recent Claims */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="animate-slide-left-fade-in">
          <CardHeader>
            <CardTitle>Claims Overview</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Replace this div with an actual chart component */}
            <div className="h-[300px] flex items-center justify-center bg-muted/10 rounded-md">
              Could possibly add a chart here?? Need data
            </div>
          </CardContent>
        </Card>

        <Card className="animate-slide-right-fade-in">
          <CardHeader>
            <CardTitle>Recent Claims</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Claim ID</TableHead>
                  <TableHead>Employee</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount (PGK)</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentClaims.map((claim) => (
                  <TableRow key={claim.id}>
                    <TableCell>{claim.id}</TableCell>
                    <TableCell>{claim.employee}</TableCell>
                    <TableCell>{claim.type}</TableCell>
                    <TableCell>{claim.amount}</TableCell>
                    <TableCell>{claim.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Provider Registrations */}
      <Card className="animate-slide-bottom-fade-in">
        <CardHeader>
          <CardTitle>Provider Registrations</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Registration ID</TableHead>
                <TableHead>Provider Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Province</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {providerRegistrations.map((provider) => (
                <TableRow key={provider.id}>
                  <TableCell>{provider.id}</TableCell>
                  <TableCell>{provider.name}</TableCell>
                  <TableCell>{provider.type}</TableCell>
                  <TableCell>{provider.province}</TableCell>
                  <TableCell>{provider.status}</TableCell>
                  <TableCell className="space-x-2">
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                    {provider.status === "Pending" && (
                      <>
                        <Button variant="outline" size="sm">
                          Approve
                        </Button>
                        <Button variant="outline" size="sm">
                          Reject
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
