const fs = require("fs");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const { PROTO_FOLDER_PATH, PROTOLOADER_CONFIG } = require("../config");

const checkFileExistence = (filePath) => {
  try {
    // Check if the file exists
    fs.accessSync(filePath, fs.constants.F_OK);
    // If the file exists, return the file path
    return filePath;
  } catch (err) {
    // If the file does not exist, throw an error
    throw new Error(`File not found: ${filePath}`);
  }
};

const loadProtoFile = (fileName) => {
  const filePath = checkFileExistence(PROTO_FOLDER_PATH + fileName);
  const packageDefinition = protoLoader.loadSync(filePath, PROTOLOADER_CONFIG);
  return grpc.loadPackageDefinition(packageDefinition);
};

module.exports = { loadProtoFile };
