#include <AceRoutine.h>
#include <WiFi.h>
#include <HTTPClient.h>
using namespace ace_routine;

const char* ssid = "*******";
const char* password = "*******";

const char* serverName = "http://172.20.10.3:3000/esp/ir";

#define LED1      42
#define LED2      41
#define LED3      40
#define IR1        5
#define IR2        6
#define IR3        7

int state1=0,state2=0,state3=0;

void post(int flo,int id,bool sta){
  if(WiFi.status()== WL_CONNECTED){
    WiFiClient client;
    HTTPClient http;
    
    // Your Domain name with URL path or IP address with path
    http.begin(client, serverName);
      
    http.addHeader("Content-Type", "application/json");
    String str = "{\"floor\":\"1\",\"id\":\"";
    str += id;
    str += "\",\"free\":\"";
    str += sta;
    str += "\"}";
    int httpResponseCode = http.POST(str);
    Serial.print(id);
    Serial.println(sta);

    Serial.print("HTTP Response code: ");
    Serial.println(httpResponseCode);
        
    // Free resources
    http.end();
  }
  else {
    Serial.println("WiFi Disconnected");
  }
}

COROUTINE(Parking1) {
  COROUTINE_LOOP() {
    if(digitalRead(IR1)==LOW){
      if(state1==0){
        COROUTINE_DELAY(5000);
        if(digitalRead(IR1)==LOW){
          digitalWrite(LED1,HIGH);
          post(1,0,true);
          Serial.println(1);
          state1=1;
        }
      }
    }
    else{
      digitalWrite(LED1,LOW);
      if(state1==1){
        post(1,0,false);
      }
      state1=0;
      Serial.println(0);
    }
    COROUTINE_DELAY(0);
  }
}

COROUTINE(Parking2) {
  COROUTINE_LOOP() {
    if(digitalRead(IR2)==LOW){
      if(state2==0){
        COROUTINE_DELAY(5000);
        if(digitalRead(IR2)==LOW){
          digitalWrite(LED2,HIGH);
          post(1,1,true);
          Serial.println(1);
          state2=1;
        }
      }
    }
    else{
      digitalWrite(LED2,LOW);
      if(state2==1){
        post(1,1,false);
      }
      state2=0;
      Serial.println(0);
    }
    COROUTINE_DELAY(0);
  }
}

COROUTINE(Parking3) {
  COROUTINE_LOOP() {
    if(digitalRead(IR3)==LOW){
      if(state3==0){
        COROUTINE_DELAY(5000);
        if(digitalRead(IR3)==LOW){
          digitalWrite(LED3,HIGH);
          post(1,2,true);
          Serial.println(1);
          state3=1;
        }
      }
    }
    else{
      digitalWrite(LED3,LOW);
      if(state3==1){
        post(1,2,false);
      }
      state3=0;
      Serial.println(0);
    }
    COROUTINE_DELAY(0);
  }
}

void setup() {
  Serial.begin(115200);
  pinMode(LED1,OUTPUT);
  pinMode(LED2,OUTPUT);
  pinMode(LED3,OUTPUT);
  pinMode(IR1,INPUT);
  pinMode(IR2,INPUT);
  pinMode(IR3,INPUT);

  WiFi.begin(ssid, password);
  Serial.println("Connecting");
  while(WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("Connected to WiFi network with IP Address: ");
  Serial.println(WiFi.localIP());
  
}

void loop() {
  Parking1.runCoroutine();
  Parking2.runCoroutine();
  Parking3.runCoroutine();
}
