/**
 * File: components/atoms/test-bank-add.tsx
 * Description: Test component for adding bank details to the system
 * Author: Aaron J. Girton - https://github.com/aj0urdain
 * Created: 2025
 *
 * This component provides a test interface for adding bank details to the system.
 * It includes form validation, error handling, and success feedback.
 */

import { useState } from "react";
import { useMutation } from "@apollo/client";
import { ADD_BANK } from "@/lib/graphql/queries";

/**
 * Bank type definition
 * Represents a bank account record in the system
 *
 * @property {number} [id] - Optional unique identifier for the bank record
 * @property {number} policyHolderId - ID of the associated policyholder
 * @property {string} name - Name of the bank
 * @property {string} branch_Number - Branch number of the bank
 * @property {string} branch_Name - Name of the bank branch
 * @property {string} account_Number - Bank account number
 * @property {string} account_Name - Name on the bank account
 */
interface Bank {
  id?: number;
  policyHolderId: number;
  name: string;
  branch_Number: string;
  branch_Name: string;
  account_Number: string;
  account_Name: string;
}

/**
 * BankTest Component
 *
 * A test component for adding bank details to the system.
 * Features:
 * - Form validation
 * - Error handling
 * - Success feedback
 * - Loading states
 * - GraphQL mutation integration
 *
 * Form Fields:
 * - Policyholder ID
 * - Bank Name
 * - Branch Number
 * - Branch Name
 * - Account Number
 * - Account Name
 *
 * @returns {JSX.Element} Test form for adding bank details
 *
 * @example
 * ```tsx
 * // Basic usage
 * <BankTest />
 *
 * // With custom styling
 * <div className="custom-container">
 *   <BankTest />
 * </div>
 * ```
 */
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

  /**
   * Handles input field changes
   * @param e - Change event from input field
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * Handles form submission
   * @param e - Form submission event
   */
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
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An error occurred while adding bank details";
      setError(errorMessage);
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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-xs focus:border-indigo-500 focus:ring-indigo-500"
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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-xs focus:border-indigo-500 focus:ring-indigo-500"
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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-xs focus:border-indigo-500 focus:ring-indigo-500"
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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-xs focus:border-indigo-500 focus:ring-indigo-500"
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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-xs focus:border-indigo-500 focus:ring-indigo-500"
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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-xs focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-xs text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
