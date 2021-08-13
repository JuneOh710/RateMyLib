import admin from 'firebase-admin';
import AppError from './AppError.js';
import { v4 as uuidv4 } from 'uuid'
import dotenv from 'dotenv'
dotenv.config()

// Imports the Google Cloud client library.
const keyFilename = '/Users/juneoh/Downloads/RateMyLib/rate-my-lib-bfd68d314ed7.json'

const firebaseAdmin = admin.initializeApp({
    credential: admin.credential.cert(keyFilename),
    storageBucket: process.env.GCLOUD_BUCKET
});

export const bucket = firebaseAdmin.storage().bucket()

export function uploadImage(req, res, next) {
    try {
        if (!req.file) {
            throw new AppError('No file uploaded', 400)
        }
        if (req.file.minetype !== 'image/png') {
            throw new AppError('you must upload an image', 400)
        }

        // upload file to Cloud Storage
        req.file.uniqueName = uuidv4()
        const blob = bucket.file(req.file.uniqueName);
        // Create writable stream and specifying file mimetype
        const blobWriter = blob.createWriteStream({
            metadata: {
                contentType: req.file.mimetype,
            },
        });

        blobWriter.on('error', (err) => next(err));

        blobWriter.on('finish', () => {
            // Assembling public URL for accessing the file via HTTP
            const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name
                }/o/${encodeURI(blob.name)}?alt=media`;
            req.file.publicUrl = publicUrl;
            next()
        });

        // When there is no more data to be consumed from the stream
        blobWriter.end(req.file.buffer);
    } catch (error) {
        next(error)
    }
}


// not a middleware
export async function deleteImageByName(imageName) {
    try {
        await bucket.file(imageName).delete()
    } catch (error) {
        next(error)
    }
}