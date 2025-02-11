"use client";

import { useEffect, useState } from "react";
import { Provider } from "@/components/atoms/admin-columns";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Building2, Hospital } from "lucide-react";
import { RegistrationDetails } from "@/components/molecules/registration-details";

async function getData(): Promise<Provider[]> {
  // Fetch data from your API here.
  return [
    {
      id: "1",
      registrationId: "PRV-2024-001",
      email: "medical@example.com",
      firstName: "John",
      lastName: "Doe",
      practiceName: "City Medical Center",
      province: "Central",
      type: "private",
    },
    {
      id: "2",
      registrationId: "PUB-2024-001",
      email: "hospital@gov.pg",
      firstName: "Jane",
      lastName: "Smith",
      practiceName: "Port Moresby General Hospital",
      province: "National Capital District",
      type: "public",
    },
    {
      id: "3",
      registrationId: "PRV-2024-002",
      email: "dental@example.com",
      firstName: "Robert",
      lastName: "Johnson",
      practiceName: "Smile Dental Clinic",
      province: "Morobe",
      type: "private",
    },
  ];
}

const AdminRegistrationsPage = () => {
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(
    null
  );
  const [data, setData] = useState<Provider[]>([]);

  // Fetch data on component mount
  useEffect(() => {
    getData().then(setData);
  }, []);

  return (
    <div className="flex gap-6 h-[calc(100vh-12rem)]">
      {/* Left side - Scrollable list */}
      <div className="w-1/4 animate-slide-left-fade-in">
        <ScrollArea className="h-full pr-4">
          <div className="flex flex-col gap-3">
            {data.map((provider) => (
              <Card
                key={provider.id}
                className={cn(
                  "cursor-pointer hover:bg-muted/50 transition-colors",
                  selectedProvider?.id === provider.id && "bg-muted"
                )}
                onClick={() => setSelectedProvider(provider)}
              >
                <CardHeader className="p-4">
                  <div className="flex items-center gap-3">
                    {provider.type === "private" ? (
                      <Building2 className="h-8 w-8 text-muted-foreground" />
                    ) : (
                      <Hospital className="h-8 w-8 text-muted-foreground" />
                    )}
                    <div>
                      <CardTitle className="text-sm">
                        {provider.practiceName}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        {provider.registrationId}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Right side - Preview */}
      <div className="w-3/4 animate-slide-right-fade-in">
        <RegistrationDetails provider={selectedProvider} />
      </div>
    </div>
  );
};

export default AdminRegistrationsPage;
