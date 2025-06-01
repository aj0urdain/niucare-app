/**
 * File: lib/aws-upload.ts
 * Description: AWS S3 file upload and URL generation utilities
 * Author: Aaron J. Girton - https://github.com/aj0urdain
 * Created: 2025
 */

import { uploadData, getUrl } from "aws-amplify/storage";
import { GET_S3_FILE_ADMIN } from "@/lib/graphql/queries";
import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_API_URL,
  cache: new InMemoryCache(),
});

/**
 * Type definition for S3 upload result with key
 */
type UploadResultWithKey = { key: string };

/**
 * Uploads a file to S3 in the specified folder
 *
 * @param {File} file - The file to upload
 * @param {string} folder - The folder path in S3 (e.g., 'private' or 'documents')
 * @param {string} [customFileName] - Optional custom filename to use instead of the original
 * @returns {Promise<{filename: string, url: string}>} Object containing the filename and public URL
 *
 * @example
 * ```ts
 * const { filename, url } = await uploadFileToS3(file, 'documents', 'custom-name.pdf');
 * ```
 */
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

  let actualFilename = fileName;
  if (result?.key) {
    const parts = result.key.split("/");
    actualFilename = parts[parts.length - 1];
  }

  const { url } = await getUrl({
    path: ({ identityId }) => `${folder}/${identityId}/${actualFilename}`,
  });

  return { filename: actualFilename, url: url.toString() };
}

/**
 * Gets a public URL for a file in S3
 *
 * @param {string} fileName - The name of the file
 * @param {string} folder - The folder path in S3
 * @returns {Promise<string>} The public URL for the file
 *
 * @example
 * ```ts
 * const url = await getS3FileUrl('document.pdf', 'documents');
 * ```
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
 * Gets a signed URL for admin access to a file in S3
 * Uses the backend's S3 signing functionality to generate a pre-signed URL
 *
 * @param {string} userBucket - The user's bucket identifier
 * @param {string} fileName - The name of the file
 * @returns {Promise<string>} The signed URL for admin access
 * @throws {Error} If the signed URL cannot be generated
 *
 * @example
 * ```ts
 * const adminUrl = await getS3FileAdmin('user123', 'document.pdf');
 * ```
 */
export async function getS3FileAdmin(
  userBucket: string,
  fileName: string
): Promise<string> {
  try {
    const key = `private/${userBucket}/${fileName}`;
    const { data } = await client.query({
      query: GET_S3_FILE_ADMIN,
      variables: {
        bucket: process.env.NEXT_PUBLIC_BUCKET_NAME,
        key,
      },
    });

    if (!data) {
      throw new Error("Failed to get signed URL");
    }

    return data.getS3FileAdmin.url;
  } catch (error) {
    console.error("Error getting signed URL:", error);
    throw error;
  }
}
