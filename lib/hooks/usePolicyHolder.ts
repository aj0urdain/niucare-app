import { useQuery } from "@apollo/client";
import { GET_EMPLOYEE_ID, GET_POLICYHOLDER } from "@/lib/graphql/queries";

export interface PolicyHolder {
  id: number;
  employeeNo: string;
  name: string;
  gender: string;
  dateOfBirth: string;
  status: string;
}

export function usePolicyHolder(employeeNo: string) {
  const {
    data: employeeData,
    loading: employeeLoading,
    error: employeeError,
  } = useQuery(GET_EMPLOYEE_ID, {
    variables: { employeeNo },
    skip: !employeeNo,
  });

  const employeeId = employeeData?.getEmployeeId;

  const {
    data: policyHolderData,
    loading: policyHolderLoading,
    error: policyHolderError,
  } = useQuery(GET_POLICYHOLDER, {
    variables: { employeeId },
    skip: !employeeId,
  });

  return {
    policyHolder: policyHolderData?.policyHolder as PolicyHolder | null,
    loading: employeeLoading || policyHolderLoading,
    error: employeeError || policyHolderError,
  };
}
