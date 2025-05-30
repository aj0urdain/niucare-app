import { gql } from "@apollo/client";

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

export const ADD_OR_UPDATE_REGISTRATION = gql(`
mutation AddOrUpdateRegistration($reg: RegistrationInput!) {
  addOrUpdateRegistration(registration: $reg) {
    id
    luhnRegistrationNumber
  }
}
`);

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
