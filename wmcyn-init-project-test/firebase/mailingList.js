"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addToMailingList = addToMailingList;
const config_1 = require("./config");
const firestore_1 = require("firebase/firestore");
async function addToMailingList(email) {
    try {
        await (0, firestore_1.addDoc)((0, firestore_1.collection)(config_1.db, 'mailingList'), {
            email,
            createdAt: (0, firestore_1.serverTimestamp)(),
        });
    }
    catch (error) {
        console.error('Error adding to mailing list:', error);
        throw error;
    }
}
