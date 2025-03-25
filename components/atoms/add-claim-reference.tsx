import { observer } from "mobx-react-lite";
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { MuiFileInput } from "mui-file-input";

import { Controller, useForm } from "react-hook-form";
import React, { useEffect } from "react";
import { LoadingButton } from "@mui/lab";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";

import {
  ADD_BANK,
  ADD_POLICYHOLDERCLAIM,
  GET_CATALOGS,
  GET_POLICYHOLDERCLAIMS,
  GET_USER_FULL_REGISTRATION,
  GET_VERIFY_CLAIM,
} from "./Queries";
import { useStore } from "./providers/StoreContext";
import { uploadData } from "@aws-amplify/storage";
import { resetFirstInputPolyfill } from "web-vitals/dist/modules/lib/polyfills/firstInputPolyfill";

export const AddPolicyHolderClaim = observer(() => {
  const store = useStore();

  const { loading, data } = useQuery(GET_CATALOGS);

  const {
    formState: { errors },
    handleSubmit,
    resetField,
    control,
  } = useForm();
  const [verifyClaim, { loading: vloading, error: verror }] = useLazyQuery(
    GET_VERIFY_CLAIM,
    { errorPolicy: "all" }
  );
  const [addbank, { loading: bloading }] = useMutation(ADD_BANK);

  const [addClaim, { loading: aloading, error: aerror }] = useMutation(
    ADD_POLICYHOLDERCLAIM,
    {
      awaitRefetchQueries: true,
      refetchQueries: [GET_POLICYHOLDERCLAIMS, "getPolicyHolderClaims"],
    }
  );
  const submitform = (formData: any) => {
    const asyncSubmitForm = async (formData: any) => {
      formData.userId = store.indexStore.userId;
      formData.status = "Pending";
      formData.claimGroup = formData.claimCode.group;
      formData.claimCode = formData.claimCode.id;
      formData.documents = formData.supporting_documents
        ? formData.supporting_documents.reduce(
            (acc: any, file: any) =>
              acc == ""
                ? (acc += `"${file.name}"`)
                : (acc += `;"${file.name}"`),
            ""
          )
        : "";
      try {
        const verifyClaimData = await verifyClaim({
          variables: {
            input: { ...formData },
          },
        });

        // store.AddPolicyholderClaimStore.setOpenBankDetailsDialog(true);
        formData.userId = store.indexStore.userId;
        formData.status = "Pending";
        store.AddPolicyholderClaimStore.setVerificationData(
          verifyClaimData.data.verifyclaim
        );
        store.AddPolicyholderClaimStore.setEmployeeNumber(formData.employeeNo);
        store.AddPolicyholderClaimStore.setFormData(formData);
        store.AddPolicyholderClaimStore.setOpenVerificationDialog(true);
      } catch (err: any) {}
    };
    asyncSubmitForm(formData).then();
  };
  const submitBankForm = (submitData: any) => {
    submitData.policyHolderId =
      store.AddPolicyholderClaimStore.verificationData?.policyHolderId;
    let bank = { ...submitData };
    bank.id = 0;
    delete bank.amount;
    delete bank.description;
    delete bank.employeeNo;
    delete bank.claimCode;
    delete bank.supporting_documents;

    addbank({
      variables: {
        bank: { ...bank },
      },
    });
    store.AddPolicyholderClaimStore.setOpenBankDetailsDialog(false);
  };

  let AddClaim = () => {
    store.AddPolicyholderClaimStore.setUploading(true);
    let parray: Promise<any>[] = [];
    addClaim({
      variables: {
        input: { ...store.AddPolicyholderClaimStore.formData },
      },
    })
      .then((data: any) => {
        let id = data.data.addClaim.id;
        if (store.AddPolicyholderClaimStore.formData.supporting_documents) {
          store.AddPolicyholderClaimStore.formData.supporting_documents.forEach(
            (file: any) => {
              parray.push(
                uploadData({
                  path: ({ identityId }) =>
                    `private/${identityId}/documents/${id}_${file.name}`,
                  data: file,
                }).result
              );
            }
          );
        }

        if (
          store.indexStore.isPsnaProvider &&
          !store.AddPolicyholderClaimStore.verificationData?.hasBank
        ) {
          store.AddPolicyholderClaimStore.setOpenBankDetailsDialog(true);
        }

        store.AddPolicyholderClaimStore.setResetDocuments(true);
      })
      .finally(() => {
        Promise.all(parray).then(() => {
          store.AddPolicyholderClaimStore.setUploading(false);
        });
      });
    store.AddPolicyholderClaimStore.setOpenVerificationDialog(false);
  };

  useEffect(() => {
    if (store.AddPolicyholderClaimStore.resetDocuments) {
      resetField("supporting_documents");
      resetField("amount");
      resetField("description");
      store.AddPolicyholderClaimStore.setResetDocuments(false);
    }
  });

  if (verror?.networkError) {
    let err: any = verror.networkError;
    store.AddPolicyholderClaimStore.setErrorMessage(err.result);
    store.AddPolicyholderClaimStore.setOpenErrorDialog(true);
    verror.networkError = null;
  }
  if (aerror?.networkError) {
    let err: any = aerror.networkError;
    store.AddPolicyholderClaimStore.setErrorMessage(err.result);
    store.AddPolicyholderClaimStore.setOpenErrorDialog(true);
    aerror.networkError = null;
  }
  const onformError = (formData: any) => {};
  const onformBankError = (formData: any) => {};
  return (
    <>
      <Box sx={{ boxShadow: 1, borderRadius: 2, p: 2 }}>
        <Stack
          spacing={{ xs: 1, sm: 1, md: 1 }}
          component="form"
          onSubmit={handleSubmit(submitform, onformError)}
        >
          <Stack direction="row" spacing={1}>
            <Controller
              name="employeeNo"
              render={({ field }) => (
                <TextField
                  error={errors.employeenumber && true}
                  helperText={errors?.employeenumber?.message?.toString()}
                  sx={{ background: "white" }}
                  label="Employee Number"
                  {...field}
                />
              )}
              control={control}
              defaultValue=""
            />

            <FormControl
              sx={{ minWidth: "50%" }}
              error={errors.claimCode && true}
            >
              <Controller
                name="claimCode"
                rules={{ required: { value: true, message: "Required" } }}
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    sx={{ background: "white" }}
                    id="claimCode"
                    defaultValue={null}
                    loading={loading}
                    options={loading ? [] : data?.catalogs}
                    onChange={(input, value: any) =>
                      field.onChange(value ?? null)
                    }
                    renderInput={(params) => (
                      <TextField {...params} label="Select Claim Type" />
                    )}
                  />
                )}
              />
              <FormHelperText>
                {errors?.pbox_Province?.message?.toString()}
              </FormHelperText>
            </FormControl>

            <Controller
              name="amount"
              render={({ field }) => (
                <TextField
                  error={errors.amount && true}
                  helperText={errors?.amount?.message?.toString()}
                  sx={{ background: "white" }}
                  label="Amount (PGK)"
                  {...field}
                />
              )}
              control={control}
              defaultValue=""
            />
          </Stack>
          <Controller
            name="description"
            render={({ field }) => (
              <TextField
                error={errors.description && true}
                helperText={errors?.description?.message?.toString()}
                sx={{ background: "white" }}
                label="Description"
                {...field}
              />
            )}
            control={control}
            defaultValue=""
          />
          <Controller
            name="supporting_documents"
            control={control}
            render={({ field }) => (
              <MuiFileInput
                multiple
                fullWidth={true}
                placeholder="Click to Select Supporting Documents"
                sx={{ background: "white" }}
                label="Select Supporting Documents"
                {...field}
                onChange={(e: any) => {
                  field.onChange(e);
                }}
              />
            )}
          />

          <LoadingButton
            loading={store.AddPolicyholderClaimStore.uploading}
            loadingIndicator="Adding.."
            variant="contained"
            type="submit"
          >
            <span>Add</span>
          </LoadingButton>
        </Stack>
      </Box>
      <Dialog open={store.AddPolicyholderClaimStore.openErrorDialog}>
        <DialogTitle>Validation Error</DialogTitle>
        <DialogContent>
          <Typography>
            {store.AddPolicyholderClaimStore.errorMessage}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              store.AddPolicyholderClaimStore.setOpenErrorDialog(false)
            }
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={store.AddPolicyholderClaimStore.openVerificationDialog}>
        <DialogTitle>
          <b>Verification</b>
        </DialogTitle>
        <DialogContent>
          <Typography>You are adding new claim to:</Typography>
          <br />
          <Typography>
            <b>Employee Number: </b>
            {store.AddPolicyholderClaimStore.employeeNumber}
          </Typography>
          <Typography>
            <b>Name: </b>
            {store.AddPolicyholderClaimStore.verificationData?.policyHolderName}
          </Typography>
          <Typography>
            <b>Gender: </b>
            {store.AddPolicyholderClaimStore.verificationData?.gender}
          </Typography>
          <Typography>
            <b>Date Of Birth: </b>
            {store.AddPolicyholderClaimStore.verificationData?.dateOfBirth.substring(
              0,
              10
            )}{" "}
          </Typography>
          <br />
          <Typography>
            <b>Claim: </b>
            {store.AddPolicyholderClaimStore.verificationData?.claimLabel}
          </Typography>
          <Typography>
            <b>Amount:</b> K
            {store.AddPolicyholderClaimStore.verificationData?.amount}{" "}
          </Typography>
          <br />
          <Typography>Are you sure?</Typography>
          <br />
          {store.AddPolicyholderClaimStore.verificationData
            ?.previousClaimAmount && (
            <div style={{ border: "2px solid orange" }}>
              <Typography style={{ color: "orange" }}>Warning</Typography>
              <Typography>
                This Member has tried to claim the same benefit in the past 90
                days. Please check that this claim is not a duplicate and is a
                valid claim. The following is the last claim that has occurred.
              </Typography>
              <Typography>
                <b>Claim: </b>
                {store.AddPolicyholderClaimStore.verificationData?.claimLabel}
              </Typography>
              <Typography>
                <b>Claim Id: </b>
                {
                  store.AddPolicyholderClaimStore.verificationData
                    ?.previousClaimId
                }
              </Typography>
              <Typography>
                <b>Previous Amount: </b> K
                {
                  store.AddPolicyholderClaimStore.verificationData
                    ?.previousClaimAmount
                }
              </Typography>
              <Typography>
                <b>Record Date: </b>
                {
                  store.AddPolicyholderClaimStore.verificationData
                    ?.previousClaimDateTime
                }
              </Typography>
              <Typography>
                <b>Description: </b>
                {
                  store.AddPolicyholderClaimStore.verificationData
                    ?.previousClaimDescription
                }
              </Typography>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              store.AddPolicyholderClaimStore.setOpenVerificationDialog(false)
            }
          >
            Cancel
          </Button>
          <Button onClick={AddClaim}>Add</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={store.AddPolicyholderClaimStore.openBankDetailsDialog}
        component="form"
        onSubmit={handleSubmit(submitBankForm, onformBankError)}
      >
        <DialogTitle>Please Provide Bank Details </DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <FormControl fullWidth={true} error={errors.bank && true}>
              <InputLabel id="bank_label">Bank Name</InputLabel>
              <Controller
                name="name"
                control={control}
                rules={{ required: { value: true, message: "Required" } }}
                render={({ field }) => (
                  <Select
                    sx={{ background: "white" }}
                    id="bank"
                    label="bank_label"
                    labelId="bank_label"
                    onChange={(data) => field.onChange(data)}
                    value={field.value ?? ""}
                  >
                    <MenuItem value="BSP">BSP</MenuItem>
                    <MenuItem value="KINA BANK">KINA BANK</MenuItem>
                    <MenuItem value="WESTPACC">WESTPAC</MenuItem>
                    <MenuItem value="ANZ">ANZ</MenuItem>
                  </Select>
                )}
              ></Controller>
              <FormHelperText>
                {errors?.bank?.message?.toString()}
              </FormHelperText>
            </FormControl>

            <Controller
              name="branch_Number"
              render={({ field }) => (
                <TextField
                  error={errors.branch_Number && true}
                  helperText={errors?.branch_Number?.message?.toString()}
                  sx={{ background: "white" }}
                  label="Bank Branch Code"
                  {...field}
                />
              )}
              control={control}
              rules={{ required: { value: true, message: "Required" } }}
              defaultValue=""
            />

            <Controller
              name="branch_Name"
              render={({ field }) => (
                <TextField
                  error={errors.branch_Name && true}
                  helperText={errors?.branch_Name?.message?.toString()}
                  sx={{ background: "white" }}
                  label="Bank Branch Name"
                  {...field}
                />
              )}
              control={control}
              rules={{ required: { value: true, message: "Required" } }}
              defaultValue=""
            />

            <Controller
              name="account_Number"
              render={({ field }) => (
                <TextField
                  error={errors.account_Number && true}
                  helperText={errors?.account_Number?.message?.toString()}
                  sx={{ background: "white" }}
                  label="Account Number"
                  {...field}
                />
              )}
              control={control}
              rules={{ required: { value: true, message: "Required" } }}
              defaultValue=""
            />

            <Controller
              name="account_Name"
              render={({ field }) => (
                <TextField
                  error={errors.account_Name && true}
                  helperText={errors?.account_Name?.message?.toString()}
                  sx={{ background: "white" }}
                  label="Account Name"
                  {...field}
                />
              )}
              control={control}
              rules={{ required: { value: true, message: "Required" } }}
              defaultValue=""
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <LoadingButton
            loading={false}
            loadingIndicator="Adding.."
            variant="contained"
            type="submit"
          >
            <span>Add</span>
          </LoadingButton>
          <Button
            onClick={() =>
              store.AddPolicyholderClaimStore.setOpenBankDetailsDialog(false)
            }
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
});
