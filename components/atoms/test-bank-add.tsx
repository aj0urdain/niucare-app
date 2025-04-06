import { useState } from "react";
import { useMutation } from "@apollo/client";
import { ADD_BANK } from "@/lib/graphql/queries";

// Define the Bank type based on the backend model
interface Bank {
  id?: number;
  policyHolderId: number;
  name: string;
  branch_Number: string;
  branch_Name: string;
  account_Number: string;
  account_Name: string;
}

export default function BankTest() {
  const [formData, setFormData] = useState({
    policyHolderId: "",
    name: "",
    branch_Number: "",
    branch_Name: "",
    account_Number: "",
    account_Name: "",
  });
  const [result, setResult] = useState<Bank | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Set up the mutation
  const [addBank, { loading }] = useMutation(ADD_BANK);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      // Create a clean bank object following the reference implementation
      const bankData: Bank = {
        id: 0,
        policyHolderId: parseInt(formData.policyHolderId, 10),
        name: formData.name,
        branch_Number: formData.branch_Number,
        branch_Name: formData.branch_Name,
        account_Number: formData.account_Number,
        account_Name: formData.account_Name,
      };

      const response = await addBank({
        variables: { bank: bankData },
      });

      setResult(response.data.addBank);
      console.log("Bank added successfully:", response.data.addBank);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An error occurred while adding bank details";
      setError(errorMessage);
      console.error("Error adding bank:", err);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">Test Bank Addition</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Policyholder ID
          </label>
          <input
            type="text"
            name="policyHolderId"
            value={formData.policyHolderId}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Bank Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Branch Number
          </label>
          <input
            type="text"
            name="branch_Number"
            value={formData.branch_Number}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Branch Name
          </label>
          <input
            type="text"
            name="branch_Name"
            value={formData.branch_Name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Account Number
          </label>
          <input
            type="text"
            name="account_Number"
            value={formData.account_Number}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Account Name
          </label>
          <input
            type="text"
            name="account_Name"
            value={formData.account_Name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {loading ? "Adding..." : "Add Bank"}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      {result && (
        <div className="mt-4 p-4 bg-green-100 rounded">
          <h3 className="font-bold">Bank Added Successfully!</h3>
          <pre className="mt-2 text-sm overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
