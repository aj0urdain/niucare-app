import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Registrations",
};

import { Provider, columns } from "@/components/atoms/admin-columns";
import { DataTable } from "@/components/organisms/data-table";
import { Separator } from "@/components/ui/separator";

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

const AdminRegistrationsPage = async () => {
  const data = await getData();

  return (
    <div className="flex flex-col gap-6 pt-6">
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default AdminRegistrationsPage;
