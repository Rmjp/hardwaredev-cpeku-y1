import { User } from './user.js';
import Firestore from '@google-cloud/firestore';
import dotenv from 'dotenv';
import { Cache } from './cache.js';

let caches = new Cache(100);

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
        this.come = null;
    }

    async checkGetEmail(license){
        if (caches.cache.has(license) == false){
            const docRef = db.collection("License").doc(license);
            let doc = await docRef.get();
            console.log("checkEmail: ", license," of:",doc.data());
            if (doc.exists){
                Object.assign(this, doc.data());
                caches.set(license, this);
                return this.email;
            }
            else{
                caches.set(license, "");
                return "";
            }
        }
        Object.assign(this, await caches.get(license));
        return this.email;
    }

    async register(license, email){
        if (await this.checkGetEmail(license) != ""){
            console.log("License is already registered : " + this.email);
            return false;
        }
        this.license = license;
        this.email = email.toLowerCase();
        caches.set(license, email);
        // const docRef = db.collection("License").doc(this.license);
        // await docRef.set({
        //     license: this.license,
        //     email: this.email
        // });
        return true;
    }

    async comeIn(license){
        if (await this.checkGetEmail(license) == ""){
            console.log("License is not registered");
            return false;
        }
        this.license = license;
        this.email = await this.checkGetEmail(license);
        this.come = new Date();
        caches.set(license, this);
        return true;
    }

    async comeOut(license){
        if (await this.checkGetEmail(license) == ""){
            console.log("License is not registered");
            return false;
        }
        this.license = license;
        const time = new Date().getMinutes() - this.come.getMinutes();
        this.come = null;
        caches.set(license, this);
        return time;
    }
}