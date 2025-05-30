import { uploadData, getUrl } from "aws-amplify/storage";
import { GET_S3_FILE_ADMIN } from "@/lib/graphql/queries";
import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_API_URL,
  cache: new InMemoryCache(),
});

/**
 * Uploads a file to S3 in the specified folder (e.g., 'private' or 'documents').
 * If customFileName is provided, uses that as the file name.
 * Returns the actual filename used and the public URL to the uploaded file.
 */
type UploadResultWithKey = { key: string };
export async function uploadFileToS3(
  file: File,
  folder: string,
  customFileName?: string
): Promise<{ filename: string; url: string }> {
  const fileName = customFileName || file.name;
  const result = (await uploadData({
    path: ({ identityId }) => `${folder}/${identityId}/${fileName}`,
    data: file,
  })) as unknown as UploadResultWithKey;
  // result.key is the actual S3 key used
  let actualFilename = fileName;
  if (result && typeof result.key === "string") {
    const parts = result.key.split("/");
    actualFilename = parts[parts.length - 1];
  }
  const { url } = await getUrl({
    path: ({ identityId }) => `${folder}/${identityId}/${actualFilename}`,
  });
  return { filename: actualFilename, url: url.toString() };
}

/**
 * Gets a public URL for a file in S3 in the specified folder.
 * If customFileName is provided, uses that as the file name.
 */
export async function getS3FileUrl(
  fileName: string,
  folder: string
): Promise<string> {
  const { url } = await getUrl({
    path: ({ identityId }) => `${folder}/${identityId}/${fileName}`,
  });
  return url.toString();
}

/**
 * Gets a signed URL for admin access to a file in S3.
 * This uses the backend's S3 signing functionality to generate a pre-signed URL.
 */
export async function getS3FileAdmin(
  userBucket: string,
  fileName: string
): Promise<string> {
  try {
    const key = `private/${userBucket}/${fileName}`;

    console.log("key", key);
    console.log("bucket", process.env.NEXT_PUBLIC_BUCKET_NAME);

    const { data } = await client.query({
      query: GET_S3_FILE_ADMIN,
      variables: {
        bucket: process.env.NEXT_PUBLIC_BUCKET_NAME,
        key,
      },
    });

    console.log("data", data);

    if (!data) {
      throw new Error("Failed to get signed URL");
    }

    return data.getS3FileAdmin.url;
  } catch (error) {
    console.error("Error getting signed URL:", error);
    throw error;
  }
}
