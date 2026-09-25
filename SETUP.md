# 丈量排程 App — 設定教學（簡化版：沿用 Firebase）

這個新 App 改用你已經用過的 **Firebase**，但建立**另一個獨立的專案**，跟案廠 App 的資料完全分開。
步驟跟你之前設定案廠 App 時幾乎一樣。

---

## 第一步：建立第二個 Firebase 專案

1. 前往 https://console.firebase.google.com ，用同一個 Google 帳號登入（不用重新註冊）。
2. 點 **新增專案**，取一個新名稱，例如 `measurement-tracker`（跟原本案廠專案的名稱不同即可）。
3. 一路照預設值按「繼續」完成建立（可以關閉 Google Analytics，不需要）。

## 第二步：開啟 Firestore 資料庫

1. 進入新專案後，左側選單點 **Firestore Database → 建立資料庫**。
2. 位置選 `asia-east1`（或離台灣近的）。
3. 安全性規則先選「**測試模式**」（跟原本案廠 App 一致，之後如需加強可以再調整）。

## 第三步：註冊網頁 App，取得設定值

1. 左側選單點專案總覽旁的 **⚙️ 設定 → 專案設定**。
2. 往下捲到「你的應用程式」，點 **</>（網頁）** 圖示，註冊一個新的網頁應用程式（名稱隨意）。
3. 會出現一段 `firebaseConfig = {...}` 的程式碼，把裡面 6 個值複製下來。

## 第四步：把設定值填進 App

打開 `index.html`，找到最上面這一段：

```js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.firebasestorage.app",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

把 6 個 `"YOUR_..."` 換成你剛剛複製到的實際值，存檔。

## 第五步：上傳到 GitHub Pages

1. 到 GitHub 建立一個**新的 repository**（例如 `measurement-tracker`），設為 Public。
2. 把這三個檔案上傳進去：`index.html`、`manifest.json`、`sw.js`
3. 到 repo 的 **Settings → Pages**，Source 選 `main` branch、`/ (root)`，儲存。
4. 幾分鐘後就能用 `https://你的帳號.github.io/measurement-tracker/` 打開 —— 這就是你要的「另外一個連結」。

之後手機和電腦都打開這個網址、用同一個名稱登入，資料就會即時互相同步，而且是**完全獨立於**案廠 App 的另一套雲端資料庫。

---

## （選用）串接 Google 日曆自動同步

如果想要「排定丈量時間」時自動寫入你的 Google 日曆，需要自己申請一組 Google OAuth 用戶端 ID：

1. 前往 https://console.cloud.google.com ，建立一個新專案（或使用現有的）。
2. 左側選單「API 和服務 → 已啟用的 API 和服務」，點 **啟用 API 和服務**，搜尋 **Google Calendar API**，啟用它。
3. 左側選單「API 和服務 → OAuth 同意畫面」，選擇 **外部**，填基本資訊儲存（開發階段選「測試使用者」時把自己的 Google 帳號加進去即可）。
4. 左側選單「API 和服務 → 憑證」，點 **建立憑證 → OAuth 用戶端 ID**：
   - 應用程式類型：**網頁應用程式**
   - 已授權的 JavaScript 來源：填入你的 GitHub Pages 網址，例如
     `https://你的帳號.github.io`
5. 建立後會拿到一組「用戶端 ID」（一長串英數字加 `.apps.googleusercontent.com`）。
6. 打開 `index.html`，找到：

```js
const GOOGLE_CLIENT_ID = '';
```

把用戶端 ID 貼進單引號中間，存檔、重新上傳。

7. 之後 App 右上角會出現「📆 連接日曆」按鈕，點一下用 Google 帳號授權後，
   新增／編輯「已排定」的丈量安排時勾選「同步到 Google 日曆」即可自動寫入你的日曆。

---

## （選用）預估車程功能

輸入地址後旁邊會自動顯示「距出發點約 XX 分鐘」，這需要一組 Google Maps API 金鑰：

1. 前往 https://console.cloud.google.com ，可以用跟 Firebase 同一個帳號、同一個專案（例如 `lin320`）
2. 左側選單「API 和服務 → 已啟用的 API 和服務」→ **啟用 API 和服務**，搜尋並啟用 **Distance Matrix API**
3. 左側選單「API 和服務 → 憑證」→ **建立憑證 → API 金鑰**，會直接產生一組金鑰
4. 建議點該金鑰進去，在「應用程式限制」選擇「HTTP 攔截程式（網站）」，把你的 GitHub Pages 網址加進去（例如 `https://linchua320-ops.github.io/*`），避免金鑰被盜用
5. 打開 `index.html`，找到：

```js
const GOOGLE_MAPS_API_KEY = '';
```

把金鑰貼進單引號中間，存檔、重新上傳。

> 注意：Google Maps API 需要 Google Cloud 帳號綁定一組帳單（有免費額度可用，一般這種個人使用量不會產生費用，但仍需要先設定好帳單方式 API 才能啟用）。如果不想設定這個，把 `GOOGLE_MAPS_API_KEY` 留空即可，App 其他功能都正常，只是不會顯示車程。

如果之後想換成別的出發地址，找到：

```js
const ORIGIN_ADDRESS = '基隆市安樂區興寮里基金一路98號';
```

直接改成新的地址就行。

---

## 關於「導航王TM」導航按鈕

目前查不到「導航王TM」（KingwayTek，App Store 上的導航 App）公開的 URL Scheme，所以「🧭 導航」按鈕目前預設開啟 Google 地圖導航。如果你之後查到導航王TM 確切的 URL Scheme，告訴我字串，我可以馬上幫你改成優先呼叫它。
