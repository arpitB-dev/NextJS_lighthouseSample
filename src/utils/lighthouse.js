import lighthouse from "@lighthouse-web3/sdk";
import kavach from "@lighthouse-web3/kavach";
const apiKey = process.env.NEXT_PUBLIC_LIGHTHOUSE_API_KEY;

export const getUploads = async () => {
  const response = await lighthouse.getUploads(apiKey);
  console.log(response);
  return response?.data?.fileList;
};

const progressCallback = (progressData) => {
  let percentageDone =
    100 - (progressData?.total / progressData?.uploaded)?.toFixed(2);
  console.log(percentageDone);
};

export const uploadFile = async (file) => {
  const output = await lighthouse.upload(
    file,
    apiKey,
    false,
    null,
    progressCallback
  );
  console.log("File Status:", output);
  alert(
    `File uploaded successfully |  Visit https://gateway.lighthouse.storage/ipfs/${output.data.Hash}`
  );
};

const signAuthMessage = async () => {
  if (window.ethereum) {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      if (accounts.length === 0) {
        throw new Error("No accounts returned from Wallet.");
      }
      const signerAddress = accounts[0];
      const { message } = (await lighthouse.getAuthMessage(signerAddress)).data;
      const signature = await window.ethereum.request({
        method: "personal_sign",
        params: [message, signerAddress],
      });
      return { signature, signerAddress };
    } catch (error) {
      console.error("Error signing message with Wallet", error);
      return null;
    }
  } else {
    console.log("Please install Wallet!");
    return null;
  }
};

// Function to upload the encrypted file
const uploadEncryptedFile = async (file) => {
  if (!file) {
    console.error("No file selected.");
    return;
  }

  try {
    // This signature is used for authentication with encryption nodes
    // If you want to avoid signatures on every upload refer to JWT part of encryption authentication section
    const encryptionAuth = await signAuthMessage();
    if (!encryptionAuth) {
      console.error("Failed to sign the message.");
      return;
    }

    const { signature, signerAddress } = encryptionAuth;

    // Upload file with encryption
    const output = await lighthouse.uploadEncrypted(
      file,
      apiKey,
      signerAddress,
      signature,
      progressCallback
    );
    console.log("Encrypted File Status:", output);
    /* Sample Response
        {
          data: [
            Hash: "QmbMkjvpG4LjE5obPCcE6p79tqnfy6bzgYLBoeWx5PAcso",
            Name: "izanami.jpeg",
            Size: "174111"
          ]
        }
      */
    // If successful, log the URL for accessing the file
    alert(
      `Decrypt at https://decrypt.mesh3.network/evm/${output.data[0].Hash}`
    );
  } catch (error) {
    console.error("Error uploading encrypted file:", error);
  }
};
