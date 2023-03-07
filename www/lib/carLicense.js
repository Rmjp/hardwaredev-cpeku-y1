import { User } from './user.js';
import Firestore from '@google-cloud/firestore';
import dotenv from 'dotenv';


dotenv.config();
const projectId = process.env.projectId
const KEYGOOGLECLOUD = process.env.KEYGOOGLECLOUD

export const db = new Firestore({
    projectId: projectId,
    keyFilename: KEYGOOGLECLOUD,
});

export class License{
    constructor() {
        this.license = null;
        this.email = "";
    }

    async checkGetEmail(license){
        const docRef = db.collection("License").doc(license);
        let doc = await docRef.get();
        if (doc.exists){
            this.email = doc.data()["email"];
            return doc.data()["email"];
        }
        return "";
    }

    async register(license, email){
        if (await this.checkGetEmail(license) != ""){
            console.log("License is already registered : " + this.email);
            return false;
        }
        this.license = license;
        this.email = email.toLowerCase();
        const docRef = db.collection("License").doc(this.license);
        await docRef.set({
            license: this.license,
            email: this.email
        });
        return true;
    }

    
}