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
export class ParkingCar {
    async send() {
        const docRef = db.collection(this.collection).doc(this.id.toString());
        let obj = Object.assign({}, this);
        delete obj.collection;
        await docRef.set(obj);
    }

    async get(collection, id) {
        const docRef = db.collection(collection).doc(id.toString());
        const doc = await docRef.get();
        if (!doc.exists) {
            console.log('No such document!');
        } else {
            console.log('Document data:', doc.data());
            Object.assign(this, doc.data());
            this.collection = collection;
        }
    }

    set(collection, floor, id, free, car_license) {
        this.floor = floor;
        this.id = id;
        this.free = free;
        this.car_license = car_license;
        this.collection = collection;
    }

    constructor() {
        this.floor = null;
        this.id = null;
        this.free = null;
        this.car_license = null;
        this.collection = null;
    }
}

export class Parking {
    constructor() {
        this.collection = null;
        this.capacity = 0;
        this.car = [];
    }

    async get(collection) {
        const collRef = await db.collection(collection).get();
        if (collRef.empty) {
            console.log('No matching collection.');
            return;
        }
        let floor = 0;
        collRef.forEach(doc => {
            console.log(doc.id, '=>', doc.data());
            let car = new ParkingCar;
            Object.assign(car, doc.data());
            car.collection = collection;
            if (car.floor > floor) {
                this.car.push([]);
            }
            this.car[car.floor - 1].push(car);
            this.capacity += 1;
        });
        this.collection = collection;
    }

    print() {
        console.log("collection: " + this.collection);
        console.log("capacity: " + this.capacity);
        console.log("car:\n");
        console.log(this.car);
    }
}
