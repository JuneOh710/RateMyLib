import admin from 'firebase-admin';
import AppError from './AppError.js';
// Imports the Google Cloud client library.
const keyFilename = '/Users/juneoh/Downloads/rate-my-lib-bfd68d314ed7.json'
// const storage = new Storage({ projectId, keyFilename });

const firebaseAdmin = admin.initializeApp({
    credential: admin.credential.cert(keyFilename),
    storageBucket: 'rate-my-lib.appspot.com'
});

export const bucket = firebaseAdmin.storage().bucket()

export function uploadImage(req, res, next) {
    try {
        if (!req.file) {
            throw new AppError('No file uploaded', 400)

        }
        // This is where we'll upload our file to Cloud Storage
        const blob = bucket.file(req.file.originalname);
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
