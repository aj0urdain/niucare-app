/**
 * File: lib/graphql/mutations.ts
 * Description: GraphQL mutation definitions for data modifications
 * Author: Aaron J. Girton - https://github.com/aj0urdain
 * Created: 2025
 */

import { gql } from "@apollo/client";

/**
 * Mutation for adding or updating a draft registration
 * Used to save or update draft registration data
 */
export const ADD_OR_UPDATE_DRAFT = gql(`
mutation AddOrUpdateDraft($draft: DraftInput!) {
  addOrUpdateDraft(draft: $draft) {
    account_Name
    account_Number
    applicant_Employment_Status
    applicantsTermsInPractice
    bank
    branch_Name
    branch_Number
    bucket
    business_Phone_Number
    business_Type
    created_Date
    email
    id
    ipa_Certificate
    ipa_Certified_Number
    ipa_Registration_Number
    isPsnaProvider
    location_Creation_Date
    location_Email
    location_Phone_Number
    luhnRegistrationNumber
    mb_Registration_Number
    medical_Certificate
    medical_Practitioner_firstname
    medical_Practitioner_lastname
    medical_Practitioner_Signiture
    mobile_Phone_Number
    pbox_Branch
    pbox_Name
    pbox_Number
    pbox_Province
    postal_Lot
    postal_Province
    postal_Section
    postal_Street
    postal_Suburb
    practice_Lot
    practice_Name
    practice_Province
    practice_Section
    practice_Street
    practice_Suburb
    premises
    ptype
    public_officer_firstname
    public_officer_lastname
    reason
    registered_Business_Name
    rn_Expiry
    status
    tin_Certificate
    updated_Date
    userId
    registrationId
  }
}
`);

/**
 * Mutation for adding or updating a registration
 * Used to create or update a complete registration record
 */
export const ADD_OR_UPDATE_REGISTRATION = gql(`
mutation AddOrUpdateRegistration($reg: RegistrationInput!) {
  addOrUpdateRegistration(registration: $reg) {
    id
    luhnRegistrationNumber
  }
}
`);

/**
 * Mutation for updating a claim's status
 * Used to change the status of a claim and optionally provide a reason
 */
export const UPDATE_CLAIM_STATUS = gql(`
mutation UpdateClaimStatus($id: Int!, $status: String!, $reason: String!) {
  updateClaimStatus(id: $id, status: $status, reason: $reason) {
    id
    policyholderId
    employeeNo
    providerId
    providerRegNumber
    label
    amount
    description
    status
    documents
    reason
    created
    userBucket
  }
}
`);

/**
 * Mutation for updating a registration's status
 * Used to change the status of a registration and optionally provide a reason
 */
export const UPDATE_REGISTRATION_STATUS = gql(`
mutation UpdateRegistrationStatus($id:String!, $status:String!, $reason:String){
  updateRegistrationStatus(id: $id, status:$status, reason:$reason){
     id
     luhnRegistrationNumber
     public_officer_firstname
     public_officer_lastname
     email
     practice_Name
     practice_Province
     ptype
     status
  }
}
`);
