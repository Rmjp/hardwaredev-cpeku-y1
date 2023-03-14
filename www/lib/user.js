import Firestore from '@google-cloud/firestore';
import dotenv from 'dotenv';
import crypto from "crypto";
import { Cache } from './cache.js';
import { channel } from 'diagnostics_channel';

let caches = new Cache(100);


dotenv.config();
const projectId = process.env.projectId
const KEYGOOGLECLOUD = process.env.KEYGOOGLECLOUD

export const db = new Firestore({
    projectId: projectId,
    keyFilename: KEYGOOGLECLOUD,
});

// create class for document
export class User{
    constructor(){
        this.name = null;
        this.email = null;
        this.car_license = [];
        this.auth = false;
        this.balance = 0;
    }

    async checkExist(email){
        if (caches.cache.has(email) == false){
            const docRef = db.collection("User").doc(email);
            let doc = await docRef.get();
            if (doc.exists){
                caches.set(email, doc.data());
                return true;
            }
            else{
                caches.set(email, false);
                return false;
            }
        }
        return caches.get(email) != false;
    }

    async getAuth(email, password){
        this.email = email;
        if (await this.checkExist(email) == false){
            return false;
        }
        if (caches.cache.has(email) == false || caches.get(email) == false){
            const docRef = db.collection("User").doc(this.email);
            const doc = await docRef.get();
            this.salt = await doc.data()["salt"];
            password = crypto.pbkdf2Sync(password, this.salt, 100000, 64, 'sha512').toString('hex');
            let hashpassword = await docRef.select("hashpassword").get();
            if (password == hashpassword){
                caches.set(email, this);
                this.auth = true;
                return true;
            }
            else{
                caches.set(email, this);
                return false;
            }
        }
        Object.assign(this, await caches.get(email));
        if(await this["hashpassword"] == crypto.pbkdf2Sync(password, this["salt"], 100000, 64, 'sha512').toString('hex')){
            this.auth = true;
            return true;
        }
        return false;
    }

    async get(email){
        if(caches.cache.has(email) == false){
            console.log("get from db");
            const docRef = db.collection("User").doc(email);
            if (this.checkExist(email) == false){
                return false;
            }
            if (this.auth == false){
                return false;
            }
            let doc = await docRef.get();
            this.name = doc.data().name;
            this.email = doc.data().email;
            this.car_license = doc.data().car_license;
            caches.set(email, this);
            return true;
        }
        if(this.auth == false){
            console.log("false auth");
            return false;
        }
        let obj = await caches.get(email);
        Object.assign(this, obj);
        this.auth = true;
        return true;
    }

    async register(name, email, password){
        if (this.checkExist(email) == true){
            return false;
        }
        this.name = name;
        this.email = email;
        this.salt = crypto.randomBytes(16).toString('hex');
        this.hashpassword = crypto.pbkdf2Sync(password, this.salt, 100000, 64, 'sha512').toString('hex');
        if(caches.cache.has(email) == false || caches.get(email) == false){
            const docRef = db.collection("User").doc(this.email);
            await docRef.set({
                name: this.name,
                email: this.email,
                salt: this.salt,
                hashpassword: this.hashpassword,
                car_license: this.car_license,
                balance: this.balance
            });
            caches.set(email, this);
        }
        return true;
    }

    async addCar(car_license){
        if (this.auth == false){
            return false;
        }
        this.car_license.push(car_license);
        if(caches.cache.has(this.email) == false || caches.get(this.email) == false){
            const docRef = db.collection("User").doc(this.email);
            await docRef.update({
                car_license: this.car_license
            });
            caches.set(this.email, this);
        }
        caches.set(this.email, this);
        return true;
    }

    async subtractBalance(amount){
        if (this.auth == false){
            return false;
        }
        if(caches.cache.has(this.email) == false || caches.get(this.email) == false){
            const docRef = db.collection("User").doc(this.email);
            this.balance = await docRef.get()["balance"];
            caches.set(this.email, this);
        }
        let obj = caches.get(this.email);
        Object.assign(this, obj);
        this.balance = Number(this.balance);
        amount = Number(amount);
        this.balance -= amount;
        // await docRef.update({
        //     balance: this.balance
        // });
        caches.set(this.email, this);
        return true;
    }

    async addBalance(amount){
        // if(caches.cache.has(this.email) == false || caches.get(this.email) == false){
        //     const docRef = db.collection("User").doc(this.email);
        //     this.balance = await docRef.get()["balance"];
        //     caches.set(this.email, this);
        // }
        let obj = caches.get(this.email);
        Object.assign(this, obj);
        amount = Number(amount);
        this.balance = parseInt(this.balance, 10);
        this.balance += amount;
        // await docRef.update({
        //     balance: this.balance
        // });
        caches.set(this.email, this);
        return true;
    }

    async getdata(){
        return {
            name: this.name,
            email: this.email,
            car_license: this.car_license,
            balance: this.balance
        }
    }
}

