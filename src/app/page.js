"use client";
import {
  getUploads,
  uploadFile,
  uploadEncryptedFile,
} from "@/utils/lighthouse";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [allfiles, setAllFiles] = useState([]);
  useEffect(() => {
    (async () => {
      await getFiles();
    })();

    return () => {};
  }, []);

  const getFiles = async () => {
    let files = await getUploads();
    setAllFiles(files);
  };

  return (
    <>
      <div className="w-100 h-100 flex flex-col p-8">
        <div className=" w-100 ">
          <div className="flex flex-row gap-2">
            <div className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded  flex flex-col">
              <input onChange={(e) => uploadFile(e.target.files)} type="file" />
              <br />
              Upload public
            </div>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex flex-col ">
              <input
                onChange={(e) => uploadEncryptedFile(e.target.files)}
                type="file"
              />
              <br />
              Upload Encrypted
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={getFiles}
            >
              Refresh
            </button>
          </div>
          <table className="min-w-full divide-y divide-gray-200 mt-8">
            <thead>
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Filename
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  CID
                </th>

                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Uploadtype
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* Your table rows go here */}
              {allfiles.map((item, index) => (
                <tr className="text-black" key={index}>
                  <td>{item?.fileName}</td>
                  <td>{item?.cid}</td>
                  <td>{item?.encryption ? "Encrypted" : "Public"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
