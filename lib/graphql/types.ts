/**
 * File: lib/graphql/types.ts
 * Description: TypeScript type definitions for GraphQL operations
 * Author: Aaron J. Girton - https://github.com/aj0urdain
 * Created: 2025
 */

/**
 * Input type for draft registration data
 * Used when creating or updating a draft registration
 */
export interface DraftInput {
  account_Name?: string | null;
  account_Number?: string | null;
  applicant_Employment_Status?: string | null;
  applicantsTermsInPractice?: string | null;
  bank?: string | null;
  branch_Name?: string | null;
  branch_Number?: string | null;
  bucket?: string | null;
  business_Phone_Number?: string | null;
  business_Type?: string | null;
  created_Date?: Date | null;
  email?: string | null;
  id?: string | null;
  ipa_Certificate?: string | null;
  ipa_Certified_Number?: string | null;
  ipa_Registration_Number?: string | null;
  isPsnaProvider: boolean;
  location_Creation_Date?: Date | null;
  location_Email?: string | null;
  location_Phone_Number?: string | null;
  luhnRegistrationNumber?: string | null;
  mb_Registration_Number?: string | null;
  medical_Certificate?: string | null;
  medical_Practitioner_firstname?: string | null;
  medical_Practitioner_lastname?: string | null;
  medical_Practitioner_Signiture?: string | null;
  mobile_Phone_Number?: string | null;
  pbox_Branch?: string | null;
  pbox_Name?: string | null;
  pbox_Number?: string | null;
  pbox_Province?: string | null;
  postal_Lot?: string | null;
  postal_Province?: string | null;
  postal_Section?: string | null;
  postal_Street?: string | null;
  postal_Suburb?: string | null;
  practice_Lot?: string | null;
  practice_Name?: string | null;
  practice_Province?: string | null;
  practice_Section?: string | null;
  practice_Street?: string | null;
  practice_Suburb?: string | null;
  premises?: string | null;
  ptype?: string | null;
  public_officer_firstname?: string | null;
  public_officer_lastname?: string | null;
  reason?: string | null;
  registered_Business_Name?: string | null;
  rn_Expiry?: Date | null;
  status?: string | null;
  tin_Certificate?: string | null;
  updated_Date?: Date | null;
  userId?: string | null;
}

/**
 * Enum for policy application timing
 * Defines when a policy should be applied in relation to resolver execution
 */
export enum ApplyPolicy {
  BEFORE_RESOLVER = "BEFORE_RESOLVER",
  AFTER_RESOLVER = "AFTER_RESOLVER",
  VALIDATION = "VALIDATION",
}

/**
 * Interface for policyholder data
 * Represents a policyholder's personal and employment information
 */
export interface Policyholder {
  id: number;
  employeeNo?: string | null;
  cardNumber?: string | null;
  name?: string | null;
  gender?: string | null;
  dateOfBirth?: Date | null;
  classification?: string | null;
  salaryFn?: number | null;
  salaryYear?: number | null;
  amount?: number | null;
}

/**
 * Interface for registration data
 * Represents a complete registration record for a service provider
 */
export interface Registration {
  id?: string | null;
  userId?: string | null;
  public_officer_firstname?: string | null;
  public_officer_lastname?: string | null;
  ipa_Certified_Number?: string | null;
  mb_Registration_Number?: string | null;
  rn_Expiry?: Date | null;
  applicantsTermsInPractice?: string | null;
  postal_Section?: string | null;
  postal_Lot?: string | null;
  postal_Street?: string | null;
  postal_Suburb?: string | null;
  postal_Province?: string | null;
  business_Phone_Number?: string | null;
  mobile_Phone_Number?: string | null;
  email?: string | null;
  location_Creation_Date?: Date | null;
  practice_Name?: string | null;
  practice_Section?: string | null;
  practice_Lot?: string | null;
  practice_Street?: string | null;
  practice_Suburb?: string | null;
  practice_Province?: string | null;
  location_Phone_Number?: string | null;
  location_Email?: string | null;
  applicant_Employment_Status?: string | null;
  registered_Business_Name?: string | null;
  ipa_Registration_Number?: string | null;
  business_Type?: string | null;
  premises?: string | null;
  bank?: string | null;
  branch_Number?: string | null;
  branch_Name?: string | null;
  account_Number?: string | null;
  account_Name?: string | null;
  medical_Practitioner_firstname?: string | null;
  medical_Practitioner_lastname?: string | null;
  medical_Practitioner_Signiture?: string | null;
  created_Date?: Date | null;
  updated_Date?: Date | null;
  status?: string | null;
  ipa_Certificate?: string | null;
  tin_Certificate?: string | null;
  medical_Certificate?: string | null;
  luhnRegistrationNumber?: string | null;
  ptype?: string | null;
  pbox_Name?: string | null;
  pbox_Number?: string | null;
  pbox_Branch?: string | null;
  pbox_Province?: string | null;
  bucket?: string | null;
  reason?: string | null;
  isPsnaProvider: boolean;
}

/**
 * Interface for claim data
 * Represents a claim record with associated metadata
 */
export interface Claim {
  id: number;
  policyholderId: number;
  employeeNo?: string | null;
  providerId?: string | null;
  providerRegNumber?: string | null;
  label?: string | null;
  amount?: number | null;
  description?: string | null;
  status?: string | null;
  documents?: string | null;
  reason?: string | null;
  created?: Date | null;
  userBucket?: string | null;
}

/**
 * Interface for catalog data
 * Represents a catalog item with pricing and grouping information
 */
export interface Catalog {
  id?: string | null;
  label?: string | null;
  multiplier: number;
  group: number;
  groupLimit: number;
}

/**
 * Interface for bank data
 * Represents banking information for a policyholder
 */
export interface Bank {
  id: number;
  name?: string | null;
  branch_Number?: string | null;
  branch_Name?: string | null;
  account_Number?: string | null;
  account_Name?: string | null;
  policyHolderId: number;
}

/**
 * Input type for registration data
 * Used when creating or updating a registration
 */
export interface RegistrationInput {
  id?: string | null;
  userId?: string | null;
  public_officer_firstname?: string | null;
  public_officer_lastname?: string | null;
  ipa_Certified_Number?: string | null;
  mb_Registration_Number?: string | null;
  rn_Expiry?: Date | null;
  applicantsTermsInPractice?: string | null;
  postal_Section?: string | null;
  postal_Lot?: string | null;
  postal_Street?: string | null;
  postal_Suburb?: string | null;
  postal_Province?: string | null;
  business_Phone_Number?: string | null;
  mobile_Phone_Number?: string | null;
  email?: string | null;
  location_Creation_Date?: Date | null;
  practice_Name?: string | null;
  practice_Section?: string | null;
  practice_Lot?: string | null;
  practice_Street?: string | null;
  practice_Suburb?: string | null;
  practice_Province?: string | null;
  location_Phone_Number?: string | null;
  location_Email?: string | null;
  applicant_Employment_Status?: string | null;
  registered_Business_Name?: string | null;
  ipa_Registration_Number?: string | null;
  business_Type?: string | null;
  premises?: string | null;
  bank?: string | null;
  branch_Number?: string | null;
  branch_Name?: string | null;
  account_Number?: string | null;
  account_Name?: string | null;
  medical_Practitioner_firstname?: string | null;
  medical_Practitioner_lastname?: string | null;
  medical_Practitioner_Signiture?: string | null;
  created_Date?: Date | null;
  updated_Date?: Date | null;
  status?: string | null;
  ipa_Certificate?: string | null;
  tin_Certificate?: string | null;
  medical_Certificate?: string | null;
  luhnRegistrationNumber?: string | null;
  ptype?: string | null;
  pbox_Name?: string | null;
  pbox_Number?: string | null;
  pbox_Branch?: string | null;
  pbox_Province?: string | null;
  bucket?: string | null;
  reason?: string | null;
  isPsnaProvider: boolean;
}

/**
 * Input type for bank data
 * Used when creating or updating banking information
 */
export interface BankInput {
  id: number;
  name?: string | null;
  branch_Number?: string | null;
  branch_Name?: string | null;
  account_Number?: string | null;
  account_Name?: string | null;
  policyHolderId: number;
}
