"use client";

import React, { useReducer } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// Define our state types
interface Employee {
  id: number;
  name: string;
  isValid: boolean;
}

interface FormState {
  stage: 'PENDING' | 'VALIDATING' | 'INVALID' | 'CHECKING_BANK' | 'HAS_BANK' | 'NO_BANK';
  employeeNumber: string;
  employeeData: Employee | null;
  error: string | null;
  isLoading: boolean;
}

// Define our action types
type FormAction =
  | { type: 'SUBMIT_EMPLOYEE'; payload: string }
  | { type: 'VALIDATION_SUCCESS'; payload: Employee }
  | { type: 'VALIDATION_ERROR'; payload: string }
  | { type: 'CHECK_BANK_DETAILS' }
  | { type: 'BANK_CHECK_SUCCESS'; payload: boolean }
  | { type: 'RESET' };

// Initial state
const initialState: FormState = {
  stage: 'PENDING',
  employeeNumber: '',
  employeeData: null,
  error: null,
  isLoading: false,
};

// Reducer function
function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'SUBMIT_EMPLOYEE':
      return {
        ...state,
        stage: 'VALIDATING',
        employeeNumber: action.payload,
        isLoading: true,
        error: null,
      };
    
    case 'VALIDATION_SUCCESS':
      return {
        ...state,
        stage: 'CHECKING_BANK',
        employeeData: action.payload,
        isLoading: true,
        error: null,
      };
    
    case 'VALIDATION_ERROR':
      return {
        ...state,
        stage: 'INVALID',
        error: action.payload,
        isLoading: false,
      };
    
    case 'BANK_CHECK_SUCCESS':
      return {
        ...state,
        stage: action.payload ? 'HAS_BANK' : 'NO_BANK',
        isLoading: false,
      };
    
    case 'RESET':
      return initialState;
    
    default:
      return state;
  }
}

// Mock API calls
const mockAPI = {
  validateEmployee: async (employeeNumber: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (employeeNumber === "12345") {
      return { id: 1, name: "John Doe", isValid: true };
    }
    throw new Error("Invalid employee number");
  },
  checkBankDetails: async (employeeId: number) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return employeeId === 1;
  }
};

const UseReducerTest = () => {
  const [state, dispatch] = useReducer(formReducer, initialState);

  // Handler functions
  const handleSubmitEmployee = async (employeeNumber: string) => {
    dispatch({ type: 'SUBMIT_EMPLOYEE', payload: employeeNumber });
    
    try {
      const employee = await mockAPI.validateEmployee(employeeNumber);
      dispatch({ type: 'VALIDATION_SUCCESS', payload: employee });
      
      // Automatically check bank details after validation
      const hasBankDetails = await mockAPI.checkBankDetails(employee.id);
      dispatch({ type: 'BANK_CHECK_SUCCESS', payload: hasBankDetails });
    } catch (error) {
      dispatch({ 
        type: 'VALIDATION_ERROR', 
        payload: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  };

  const handleReset = () => {
    dispatch({ type: 'RESET' });
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">useReducer Test Page</h1>
      
      <Card className="p-6 mb-6">
        <h2 className="text-xl mb-4">Current Stage: {state.stage}</h2>
        <pre className="bg-gray-100 p-4 rounded mb-4">
          {JSON.stringify(state, null, 2)}
        </pre>

        {state.stage === 'PENDING' && (
          <div className="space-y-4">
            <p>Try employee number &quot;12345&quot; for success flow</p>
            <Button 
              onClick={() => handleSubmitEmployee("12345")}
              className="mr-2"
            >
              Submit Valid Employee
            </Button>
            <Button 
              onClick={() => handleSubmitEmployee("99999")}
              variant="secondary"
            >
              Submit Invalid Employee
            </Button>
          </div>
        )}

        {(state.stage === 'INVALID' || state.stage === 'NO_BANK' || state.stage === 'HAS_BANK') && (
          <Button onClick={handleReset}>
            Start Over
          </Button>
        )}

        {state.isLoading && (
          <div className="animate-pulse mt-4">Loading...</div>
        )}

        {state.error && (
          <div className="text-red-500 mt-4">Error: {state.error}</div>
        )}
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-2">How to Test:</h2>
        <ol className="list-decimal list-inside space-y-2">
          <li>Click &quot;Submit Valid Employee&quot; (12345) to see successful flow</li>
          <li>Click &quot;Submit Invalid Employee&quot; to see error handling</li>
          <li>Watch state transitions in real-time</li>
          <li>Observe loading states during API calls</li>
          <li>Check the state updates in the JSON display</li>
        </ol>
      </Card>
    </div>
  );
};

export default UseReducerTest;
