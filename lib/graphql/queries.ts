import { gql } from "@apollo/client";

export const GET_USER_REGISTRATION = gql(`
query GetUserRegistration($userId: String!) {
    registrationByUserId(userId:$userId)
    {
      id
      ptype
      status
      reason
      bucket
      isPsnaProvider
   }
}
`);

export const CHECK_OPENFGA = gql`
  query check($userId: String!, $permission: String!) {
    check(userId: $userId, permission: $permission)
      @rest(
        path: "/openfga/check?userId={args.userId}&permission={args.permission}"
        method: "GET"
      ) {
      allowed
    }
  }
`;

export const SIGNURL = gql(`
fragment Payload on REST {
bucket: String,
key: String
}
query signurl ($input:Payload!){
    signurl(input:$input) @rest(path:"/amazon/signurl", method:"POST"){
    url
    }
}
`);

export const GET_VERIFY_CLAIM = gql(`
fragment verifyClaim on REST {
    userId:String,
    employeeNo:String,
    claimCode:Number,
    amount:Float,
    description:String,
    status:String,
}
query verifyclaim ($input:verifyClaim!){
    verifyclaim(input:$input) @rest(path:"/claim/verifyclaim", method:"POST"){
    type
    policyHolderName
    claimLabel
    amount
    description
    previousClaimAmount
    previousClaimDateTime
    previousClaimDescription
    previousClaimId
    }
}
`);
/*
export const IMPORT = gql(`
fragment Import on REST {
Input: String,
}
query import ($input:Import!){
    import(input:$input) @rest(path:"/amazon/import", method:"POST", endpoint:"batch"){
}
}
`)*/

// only available to admins
export const GET_REGISTRATIONS = gql(`
query getRegistrations($province: String!, $type: String!, $status: String!){
    registrations(province:$province, type:$type, status:$status){
     id,
     userId
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

export const GET_POLICYHOLDERCLAIMS = gql(`
query getPolicyHolderClaims($userId: String!, $providerRegNumber: String!, $claimId: String!, $employeeNo: String!, $claimCode: String!, $status: String!) {
  policyHolderClaims(
    userId: $userId
    providerRegNumber: $providerRegNumber
    claimId: $claimId
    employeeNo: $employeeNo
    claimCode: $claimCode
    status: $status
  ) {
    id
    employeeNo
    providerRegNumber
    label
    amount
    description
    status
    documents
    reason
    userBucket
    __typename
  }
}
`);

export const GET_CATALOGS = gql(`
query getCatalogs{
    catalogs{
     id
     group
     label
    }
}
`);

export const ADD_POLICYHOLDERCLAIM = gql(`
fragment AddClaim on REST {
    userId,
    employeeNo,
    claimCode,
    claimGroup,
    amount,
    description,
    status,
}
mutation AddClaim($input:AddClaim!){
  addClaim(input:$input) @rest(path:"/claim/addclaim", method:"POST"){
    id
    }
}
`);

export const ADD_BANK = gql(`
mutation AddBank($bank:BankInput!){
  addBank(bank: $bank){
          id
  }
}`);

export const ADD_REGISTRATION = gql(`
fragment AddRegistration on REST {
    id,
    public_officer_firstname,
    public_officer_lastname,
    ipa_Certified_Number,
    mb_Registration_Number,
    rn_Expiry,
    applicantsTermsInPractice,
    postal_Section,
    postal_Lot,
    postal_Street,
    postal_Suburb,
    postal_Province,
    business_Phone_Number,
    mobile_Phone_Number,
    email,
    location_Creation_Date,
    practice_Name,
    practice_Section,
    practice_Lot,
    practice_Street,
    practice_Suburb,
    practice_Province,
    location_Phone_Number,
    location_Email,
    applicant_Employment_Status,
    registered_Business_Name,
    ipa_Registration_Number,
    business_Type,
    premises,
    bank,
    branch_Number,
    branch_Name,
    account_Number,
    account_Name,
    medical_Practitioner_firstname,
    medical_Practitioner_lastname,
    medical_Practitioner_Signiture,
    userId,
    ipa_Certificate,
    tin_Certificate,
    medical_Certificate,
    luhnRegistrationNumber,
    ptype,
    bucket,
    pbox_Name,
    pbox_Branch,
    pbox_Province,
    pbox_Number
}
mutation AddRegistration($input: AddRegistration!) {
    addRegistration(input: $input) @rest(path: "/registration/add", method: "POST") {
        id
        status
        userId
        luhnRegistrationNumber
    }
}
`);

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

export const DELETE_CLAIM = gql(`
mutation DeleteClaim($id:Int!){
    deleteClaim(id: $id){
        id
    }
}
`);

export const GET_REGISTRATION = gql(`
query GetRegistration($userId: String!) {
    registration(userId: $userId) @rest(path: "/registration?userId={args.userId}", method: "GET") {
        id
        public_officer_firstname
        public_officer_lastname
        ipa_Certified_Number
        mb_Registration_Number
        rn_Expiry
        applicantsTermsInPractice
        postal_Section
        postal_Lot
        postal_Street
        postal_Suburb
        postal_Province
        business_Phone_Number
        mobile_Phone_Number
        email
        location_Creation_Date
        practice_Name
        practice_Section
        practice_Lot
        practice_Street
        practice_Suburb
        practice_Province
        location_Phone_Number
        location_Email
        applicant_Employment_Status
        registered_Business_Name
        ipa_Registration_Number
        business_Type
        premises
        bank
        branch_Number
        branch_Name
        account_Number
        account_Name
        medical_Practitioner_firstname
        medical_Practitioner_lastname
        medical_Practitioner_Signiture
        medical_Certificate
        ipa_Certificate
        tin_Certificate
        created_Date
        updated_Date
        luhnRegistrationNumber
        status
        pbox_Name
        pbox_Branch
        pbox_Province
        pbox_Number
        bucket
        userId
    }
}
`);

export const GET_USER_FULL_REGISTRATION = gql(`
query GetUserFullRegistration($userId: String!) {
    registrationByUserId(userId:$userId)
    {
      id
      public_officer_firstname
      public_officer_lastname
      ipa_Certified_Number
      mb_Registration_Number
      rn_Expiry
      applicantsTermsInPractice
      postal_Section
      postal_Lot
      postal_Street
      postal_Suburb
      postal_Province
      business_Phone_Number
      mobile_Phone_Number
      email
      location_Creation_Date
      practice_Name
      practice_Section
      practice_Lot
      practice_Street
      practice_Suburb
      practice_Province
      location_Phone_Number
      location_Email
      applicant_Employment_Status
      registered_Business_Name
      ipa_Registration_Number
      business_Type
      premises
      bank
      branch_Number
      branch_Name
      account_Number
      account_Name
      medical_Practitioner_firstname
      medical_Practitioner_lastname
      medical_Practitioner_Signiture
      medical_Certificate
      ipa_Certificate
      tin_Certificate
      created_Date
      updated_Date
      luhnRegistrationNumber
      status
      pbox_Name
      pbox_Branch
      pbox_Province
      pbox_Number
      bucket
      ptype
      reason
   }
}
`);

export const GET_EMPLOYEE_ID = gql`
  query getEmployeeId($employeeNo: String!) {
    employeeId(employeeNo: $employeeNo)
  }
`;

export const GET_POLICYHOLDER = gql(`
query getPolicyHolder($employeeId: Int!) {
  policyHolder(employeeId: $employeeId) @rest(path:"/policyholder/{args.employeeId}", method:"GET") {
    id: Int
    employeeNo: String
    name: String
    gender: String
    dateOfBirth: String
    status: String
  }
}
`);

// export const GET_HAS_BANK_DETAILS = gql(`
// fragment hasBankDetails on REST {
//     userId:String,
//     employeeNo:String,
// }
// query hasBankDetails ($input:hasBankDetails!){
//     hasBankDetails(input:$input) @rest(path:"/claim/hasbankdetails", method:"POST"){
//     hasBank
//     }
// }
// `);

export const GET_HAS_BANK_DETAILS = gql`
  query hasBankDetails($employeeNo: String!) {
    hasBankDetails(employeeNo: $employeeNo)
      @rest(
        type: "Boolean"
        path: "/claim/hasBankDetails?employeeNo={args.employeeNo}"
        method: "GET"
      )
  }
`;

export const GET_POLICY_HOLDER_BY_EMPLOYEE_NO = gql`
  query GetPolicyHolderByEmployeeNo($employeeNo: String!) {
    policyHolderByEmployeeNo(employeeNo: $employeeNo) {
      id
      employeeNo
      cardNumber
      name
      gender
      dateOfBirth
      classification
      salaryFn
      salaryYear
      amount
    }
  }
`;

export const DRAFTS_BY_USER_ID = gql`
  query DraftsByUserId($userId: String!) {
    draftByUserId(userId: $userId) {
      id
      public_officer_firstname
      public_officer_lastname
      email
      business_Phone_Number
      location_Creation_Date
      location_Phone_Number
      location_Email
      practice_Section
      practice_Lot
      practice_Street
      practice_Suburb
      practice_Province
      postal_Section
      postal_Lot
      postal_Street
      postal_Suburb
      postal_Province
      applicant_Employment_Status
      registered_Business_Name
      tin_Certificate
      ipa_Registration_Number
      ipa_Certified_Number
      premises
      business_Type
      practice_Name
      ptype
      bank
      branch_Number
      branch_Name
      account_Number
      account_Name
      ipa_Certificate
      medical_Certificate
      medical_Practitioner_firstname
      medical_Practitioner_lastname
      medical_Practitioner_Signiture
      pbox_Name
      pbox_Number
      pbox_Branch
      pbox_Province
      isPsnaProvider
      updated_Date
      mobile_Phone_Number
      applicantsTermsInPractice
      mb_Registration_Number
      rn_Expiry
      reason
    }
  }
`;

export const GET_POLICYHOLDER_BY_EMPLOYEE_NO = gql(`
query GetPolicyHolderByEmployeeNo($employeeNo: String!) {
  policyHolderByEmployeeNo(employeeNo: $employeeNo) {
    id
    employeeNo
    cardNumber
    name
    gender
    dateOfBirth
    classification
    salaryFn
    salaryYear
    amount
  }
}
`);

export const GET_DRAFT_BY_USER_ID = gql(`
query GetDraftByUserId($userId: String!) {
  draftByUserId(userId: $userId) {
    id
    userId
    public_officer_firstname
    public_officer_lastname
    ipa_Certified_Number
    mb_Registration_Number
    rn_Expiry
    applicantsTermsInPractice
    postal_Section
    postal_Lot
    postal_Street
    postal_Suburb
    postal_Province
    business_Phone_Number
    mobile_Phone_Number
    email
    location_Creation_Date
    practice_Name
    practice_Section
    practice_Lot
    practice_Street
    practice_Suburb
    practice_Province
    location_Phone_Number
    location_Email
    applicant_Employment_Status
    registered_Business_Name
    ipa_Registration_Number
    business_Type
    premises
    bank
    branch_Number
    branch_Name
    account_Number
    account_Name
    medical_Practitioner_firstname
    medical_Practitioner_lastname
    medical_Practitioner_Signiture
    created_Date
    updated_Date
    status
    ipa_Certificate
    tin_Certificate
    medical_Certificate
    luhnRegistrationNumber
    ptype
    pbox_Name
    pbox_Number
    pbox_Branch
    pbox_Province
    bucket
    reason
    isPsnaProvider
  }
}
`);

export const GET_BANK = gql(`
query GetBank($policyHolderId: Int!) {
  bank(policyHolderId: $policyHolderId) {
    id
    name
    branch_Number
    branch_Name
    account_Number
    account_Name
    policyHolderId
  }
}
`);

export const GET_DASHBOARD_CLAIMS = gql`
  query GetDashboardStatClaims(
    $userId: String
    $startDate: String
    $endDate: String
  ) {
    dashboardStatClaims(
      userId: $userId
      startDate: $startDate
      endDate: $endDate
    )
      @rest(
        path: "/dashboard/claimstat?userId={args.userId}&startDate={args.startDate}&endDate={args.endDate}"
        method: "GET"
      ) {
      result
    }
  }
`;

export const GET_S3_FILE_ADMIN = gql(`
fragment FileBucket on REST {
bucket: String,
key: String
}
query getS3FileAdmin ($input:FileBucket!){
    signurl(input:$input) @rest(path:"/amazon/signurl", method:"POST"){
    url
    }
}
`);
