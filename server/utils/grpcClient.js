const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

// Try multiple possible paths for the proto file
const fs = require('fs');
const possiblePaths = [
    path.join(__dirname, '../proto/summarize/summarize.proto'),
    path.join(__dirname, '../../microservice/summarize/summarize.proto'),
    path.join(process.cwd(), 'microservice/summarize/summarize.proto')
];

let PROTO_PATH = possiblePaths[0];
for (const protoPath of possiblePaths) {
    try {
        fs.accessSync(protoPath);
        PROTO_PATH = protoPath;
        break;
    } catch (e) {
        // Continue to next path
    }
}
const GRPC_SERVER = process.env.GRPC_SERVER_ADDR || 'localhost:8000';

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});

const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
const summarize = protoDescriptor.summarize;

function getClient() {
    return new summarize.Summarize(GRPC_SERVER, grpc.credentials.createInsecure());
}

async function summarizeUrl(videoUrl, features, role) {
    return new Promise((resolve, reject) => {
        const client = getClient();
        const request = {
            video_url: videoUrl,
            features: features || [],
            role: role || 'FREE'
        };

        client.SummarizeUrl(request, (error, response) => {
            if (error) {
                reject(error);
            } else {
                if (response.error) {
                    reject(new Error(response.error));
                } else {
                    resolve({
                        summary: response.summary,
                        questions: response.questions || "",
                        buffer: response.image_base64 || "",
                    });
                }
            }
        });
    });
}

async function summarizeText(text, features, role) {
    return new Promise((resolve, reject) => {
        const client = getClient();
        const request = {
            text: text,
            features: features || [],
            role: role || 'FREE'
        };

        client.SummarizeText(request, (error, response) => {
            if (error) {
                reject(error);
            } else {
                if (response.error) {
                    reject(new Error(response.error));
                } else {
                    resolve({
                        summary: response.summary,
                        questions: response.questions || "",
                        buffer: response.image_base64 || "",
                    });
                }
            }
        });
    });
}

module.exports = { summarizeUrl, summarizeText };
