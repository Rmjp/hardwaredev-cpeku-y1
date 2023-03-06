import Firestore from '@google-cloud/firestore';
import dotenv from 'dotenv';


dotenv.config();
const projectId = process.env.projectId
const KEYGOOGLECLOUD = process.env.KEYGOOGLECLOUD

export const db = new Firestore({
    projectId: projectId,
    keyFilename: KEYGOOGLECLOUD,
});

// create class for document
export class Parking {
    async set() {
        const docRef = db.collection(this.collection).doc(this.id.toString());
        let obj = Object.assign({}, this);
        delete obj.collection;
        await docRef.set(obj);
    }

    constructor(collection, floor, id, free, car_license) {
        this.floor = floor;
        this.id = id;
        this.free = free;
        this.car_license = car_license;
        this.collection = collection;
    }
}

