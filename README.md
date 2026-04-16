# 🌍 Obolus API – Cross-Country Income & Tax Engine

Compare net income, taxes, and purchasing power across countries with one consistent model.

---
## ⚡ From salary → decision

€60k Germany → €1,613/month available  
€60k Austria → €1,850/month available  

→ +€237 difference

---
## ⚡ What this enables

Input a salary → get comparable real-world outcomes across countries:

* Net income after taxes
* Social contributions
* Available income after costs
* Cross-country comparisons

👉 Built for relocation tools, expat planning, and fintech apps.

---

## 🧪 Example

**Input:**

```json
{
  "country": "DE",
  "gross": 60000,
  "year": 2026
}
```

**Output (simplified):**

```json
{
  "net": 36611,
  "monthly_available": 1613
}
```

👉 Now compare instantly with other countries:

```json
{
  "countries": ["DE", "AT", "CH", "AU"]
}
```

---

## 🌐 Why this API is different

Most tools:

* country-specific
* inconsistent assumptions
* not comparable

**Obolus:**

* same calculation model across countries
* comparable outputs by design
* built for real decisions (not just tax math)

---

## 🔗 Live API

POST `/api/berechne` → calculate net income
POST `/api/taxcompare` → compare across countries

Base URL:

```
https://www.obolusfinanz.de/api
```

Docs:
👉 https://www.obolusfinanz.de/en/developers
👉 https://www.obolusfinanz.de/api/openapi

---

## 🧑‍💻 Quickstart

```js
const res = await fetch("https://www.obolusfinanz.de/api/taxcompare", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    annual_gross: 60000,
    tax_year: "2026",
    countries: ["DE", "AT", "CH"]
  })
})

const data = await res.json()
console.log(data)
```

---

## 🌍 Supported countries

* Germany 🇩🇪
* Austria 🇦🇹
* Switzerland 🇨🇭
* USA 🇺🇸
* UK 🇬🇧
* Australia 🇦🇺
* Canada 🇨🇦
* Ireland 🇮🇪

---

## 🧩 Use cases

* relocation decision tools
* expat financial planning
* payroll simulations
* salary benchmarking
* fintech apps
* cost-of-living tools

---

## 🧱 This repo

Minimal frontend example using:

* plain HTML / CSS / JS
* Vite dev setup
* direct API calls

Includes:

* payroll calculator demo
* salary comparison demo

👉 Designed to be copied into your own project.

---

## 🔐 Authentication

Optional API key:

```
x-public-api-key: YOUR_API_KEY
```

---

## ⚙️ Local development

```bash
npm install
npm run dev
```

Open:

```
http://localhost:8080
```

Uses Vite proxy to avoid CORS issues.

---

## 💡 Notes

* `berechne` uses minor currency units (cents)
* `taxcompare` uses major units
* advanced product logic intentionally excluded

---

## 🚀 Build on top

This is the same engine used in:

👉 https://www.obolusfinanz.de/en

---

## 📬 Feedback

If you build something with it or have ideas → would love to hear it.

