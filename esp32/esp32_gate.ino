#include <qrcoderm.h>
#include <esp_now.h>
#include <esp_wifi.h>
#include <WiFi.h>
#include <SPI.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <Arduino.h>
#include <HTTPClient.h>

// REPLACE WITH YOUR RECEIVER MAC Address
uint8_t broadcastAddress[] = {0x0C, 0xB8, 0x15, 0x74, 0xE7, 0x88};

#define SCREEN_WIDTH 128 // OLED display width, in pixels
#define SCREEN_HEIGHT 64 // OLED display height, in pixels

// Declaration for an SSD1306 display connected to I2C (SDA, SCL pins)
#define OLED_RESET     -1 // Reset pin # (or -1 if sharing Arduino reset pin)
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

const char *ssid = "*******";
const char *password = "*******";
const char *HOSTid = "http://172.20.10.3:3000/lcd/id";
const char *HOSTmsg = "http://172.20.10.3:3000/lcd/msg";
const char *HOSTweb = "http://172.20.10.3:3000";

QRCode qrcode;


int32_t getWiFiChannel(const char *ssid) {
  if (int32_t n = WiFi.scanNetworks()) {
      for (uint8_t i=0; i<n; i++) {
          if (!strcmp(ssid, WiFi.SSID(i).c_str())) {
              return WiFi.channel(i);
          }
      }
  }
  return 0;
}



int trigger;
#define IR1    5
#define IR2    6



esp_now_peer_info_t peerInfo;

void lcd_print(const char *str,int t){
  const int w = 60;
  const int h = 20;
  display.clearDisplay();
  display.setTextSize(1);             
  display.setTextColor(WHITE); 
  if(str=="Please register"){
    display.setCursor(0,0);    
  }
  else{
    display.setCursor(0,30);
  }
  display.println(str);
  display.display();
  delay(t);
}

void qr(const char *str){
  uint8_t qrcodeBytes[qrcode_getBufferSize(1)];
  qrcode_initText(&qrcode, qrcodeBytes, 1, ECC_LOW, str);
  display.fillRect(37,16,46,46, WHITE);
  for (uint8_t y = 0; y < qrcode.size; y++) {
    for (uint8_t x = 0; x < qrcode.size; x++) {
      if (qrcode_getModule(&qrcode, x, y)) {
        display.fillRect(x*2 + 39, y*2 + 18, 2, 2, BLACK);
      }
    }
    Serial.print("\n");
  }
  display.setTextSize(1);             // Normal 1:1 pixel scale
  display.setTextColor(WHITE);        // Draw white text
  display.setCursor(10,0);             // Start at top-left corner
  display.display(); // Update screen with each newly-drawn rectangle
  delay(5000);
}

String reg = "reg";
String id;
bool get_event() {
  HTTPClient http;
  http.begin(HOSTid);
  int httpCode = http.GET();
  String response;
  // Print response to Serial Monitor
  if (httpCode > 0) {
    response = http.getString();
    if(response == id){
      http.end();
      return false;
    }
    Serial.println(response);
  }
  else{
    Serial.println(httpCode);
    http.end();
    return false;
  }
  http.end(); // Free resources
  id = response;

  http.begin(HOSTmsg);
  httpCode = http.GET();
  // Print response to Serial Monitor
  if (httpCode > 0) {
    response = http.getString();
    Serial.println(response);
    if(response.equals(reg)){
      lcd_print("Please register",1);
      qr(HOSTweb);
    }
    else{
      lcd_print(response.c_str(),5000);
    }
  }
  else{
    Serial.println(httpCode);
    http.end();
    return false;
  }
  http.end();
  return true;
}

// callback when data is sent
void OnDataSent(const uint8_t *mac_addr, esp_now_send_status_t status) {
  Serial.print("\r\nLast Packet Send Status:\t");
  Serial.println(status == ESP_NOW_SEND_SUCCESS ? "Delivery Success" : "Delivery Fail");
}
 
void setup() {
  // Init Serial Monitor
  Serial.begin(115200);
  pinMode(IR1,INPUT);
  pinMode(IR2,INPUT);
  Wire.begin(48, 47);
  if(!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) { 
    Serial.println(F("SSD1306 allocation failed"));
    for(;;); // Don't proceed, loop forever
  }

  display.display();
  delay(2000); 
 
  // Set device as a Wi-Fi Station
  WiFi.mode(WIFI_STA);

  Serial.print("Connecting to ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);  
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }
  Serial.print("Station IP Address: ");
  Serial.println(WiFi.localIP());
  Serial.print("Wi-Fi Channel: ");
  Serial.println(WiFi.channel());

  // Init ESP-NOW
  if (esp_now_init() != ESP_OK) {
    Serial.println("Error initializing ESP-NOW");
    return;
  }

  // Once ESPNow is successfully Init, we will register for Send CB to
  // get the status of Trasnmitted packet
  esp_now_register_send_cb(OnDataSent);
  
  // Register peer
  memcpy(peerInfo.peer_addr, broadcastAddress, 6);
  peerInfo.channel = 0;  
  peerInfo.encrypt = false;
  
  // Add peer        
  if (esp_now_add_peer(&peerInfo) != ESP_OK){
    Serial.println("Failed to add peer");
    return;
  }
}
 
void loop() {
  if(digitalRead(IR1)==0){
    delay(5000);
    if(digitalRead(IR1)==0){
      lcd_print("Taking Photo.....",1);
      trigger=1;
      esp_err_t result = esp_now_send(broadcastAddress, (uint8_t *) &trigger, sizeof(trigger));
      if (result == ESP_OK) {
        Serial.println("Sent with success");
        while(get_event()!=1){
          delay(100);
        }
      }
      else {
        Serial.println("Error sending the data");
      }
    }
  }
  if(digitalRead(IR2)==0){
    delay(5000);
    if(digitalRead(IR2)==0){
      lcd_print("Taking Photo.....",1);
      trigger=2;
      esp_err_t result = esp_now_send(broadcastAddress, (uint8_t *) &trigger, sizeof(trigger));
      if (result == ESP_OK) {
        Serial.println("Sent with success");
        while(get_event()!=1){
          delay(100);
        }
      }
      else {
        Serial.println("Error sending the data");
      }
    }
  }
  lcd_print("Welcome",1);
}
