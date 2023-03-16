# กลุ่มที่ 8 : ลิงกินผัก

## สมาชิก
- กาลวัฏ งามเจตนรมย์
- รัญชน์ นาคจีน
- ลภัส ฉัตรจตุรภัทร
- ศุภาพิชญ์ ช่วยชูหนู

โครงงานนี้เป็นส่วนหนึ่งของรายวิชา 01204114 Introduction to Computer Hardware Development คณะวิศวกรรมศาสตร์ ภาควิศวกรรมศาสตร์คอมพิวเตอร์ มหาวิทยาลัยเกษตรศาสตร์

# Diretories
```
├── LICENSE
├── README.md
├── Schematic_Linking_Parking.pdf #(Schematic)
├── esp32 #(Code for ESP32)
│   ├── esp32_cam.ino #(Camera)
│   ├── esp32_gate.ino #(Gate)
│   └── esp32_parking.ino #(Parking IR)
├── react #(Code for Client)
│   ├── README.md
│   ├── package-lock.json
│   ├── package.json
│   ├── public
│   │   ├── favicon.ico
│   │   ├── index.html
│   │   ├── logo192.png
│   │   ├── logo512.png
│   │   ├── manifest.json
│   │   ├── pictures
│   │   │   ├── parking-dark.png
│   │   │   ├── parking-light.png
│   │   │   ├── plus-dark.png
│   │   │   ├── plus.png
│   │   │   ├── profile.png
│   │   │   ├── settings-dark.png
│   │   │   ├── settings-light.png
│   │   │   ├── user-dark.png
│   │   │   └── user-light.png
│   │   └── robots.txt
│   └── src
│       ├── App.css
│       ├── App.js
│       ├── App.test.js
│       ├── components
│       │   ├── Home.js
│       │   ├── Parkingstatus.js
│       │   ├── account
│       │   │   ├── Account.css
│       │   │   ├── Account.js
│       │   │   ├── Balance.js
│       │   │   ├── license
│       │   │   │   ├── AddLicense.js
│       │   │   │   ├── Carlicense.js
│       │   │   │   └── License.js
│       │   │   └── login
│       │   │       ├── Login.js
│       │   │       ├── SignIn.js
│       │   │       └── SignUp.js
│       │   ├── list
│       │   │   ├── ItemInList.js
│       │   │   └── Parkinglist.js
│       │   ├── navigation
│       │   │   ├── Navigationback.js
│       │   │   └── Navigationbar.js
│       │   └── table
│       │       ├── Parkingblock.js
│       │       └── Parkingtable.js
│       ├── index.css
│       ├── index.js
│       ├── logo.svg
│       ├── reportWebVitals.js
│       ├── setupTests.js
│       └── variablesSetting.js
└── www #(Code for Server)
    ├── index.js
    ├── lib
    │   ├── cache.js
    │   ├── carLicense.js
    │   ├── park.js
    │   └── user.js
    ├── package-lock.json
    ├── package.json
    ├── test
    └── test.html
```
# Libary อุปกรณ์ที่ใช้
- ESP32
- ESP32-CAM
- IR Sensor
- OLED-SSD1306
- React
- Node.js