import Firestore from '@google-cloud/firestore';
import dotenv from 'dotenv';
import crypto from "crypto";


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
        const docRef = db.collection("User").doc(email);
        let doc = await docRef.get();
        if (doc.exists){
            return true;
        }
        return false;
    }

    async getAuth(email, password){
        if (this.checkExist(email) == false){
            return false;
        }
        const docRef = db.collection("User").doc(this.email);
        let salt = await docRef.select("salt").get();
        password = crypto.pbkdf2Sync(password, this.salt, 100000, 64, 'sha512').toString('hex');
        let hashpassword = await docRef.select("hashpassword").get();
        if (password == hashpassword){
            this.auth = true;
            return true;
        }
        return false;
    }

    async get(email){
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
        return true;
    }

    async register(name, email, password){
        if (this.checkExist(email) == true){
            return false;
        }
        this.name = name;
        this.email = email;
        let salt = crypto.randomBytes(16).toString('hex');
        let hashpassword = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
        const docRef = db.collection("User").doc(this.email);
        await docRef.set({
            name: this.name,
            email: this.email,
            salt: salt,
            hashpassword: hashpassword,
            car_license: this.car_license
        });
        return true;
    }

    async addCar(car_license){
        if (this.auth == false){
            return false;
        }
        this.car_license.push(car_license);
        const docRef = db.collection("User").doc(this.email);
        await docRef.update({
            car_license: this.car_license
        });
        return true;
    }

    async subtractBalance(amount){
        if (this.auth == false){
            return false;
        }
        const docRef = db.collection("User").doc(this.email);
        this.balance = await docRef.get()["balance"];
        this.balance -= amount;
        await docRef.update({
            balance: this.balance
        });
        return true;
    }
}

