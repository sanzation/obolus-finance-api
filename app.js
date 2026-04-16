const tabButtons = document.querySelectorAll("[data-tab-target]");
const demoPanels = document.querySelectorAll(".demo-panel");

const payrollForm = document.querySelector("#payrollForm");
const payrollSubmit = document.querySelector("#payrollSubmit");
const payrollStatus = document.querySelector("#payrollStatus");
const payrollResult = document.querySelector("#payrollResult");

const compareForm = document.querySelector("#compareForm");
const compareSubmit = document.querySelector("#compareSubmit");
const compareStatus = document.querySelector("#compareStatus");
const compareResult = document.querySelector("#compareResult");

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const targetId = button.getAttribute("data-tab-target");
    tabButtons.forEach((entry) => entry.classList.remove("is-active"));
    demoPanels.forEach((panel) => panel.classList.remove("is-active"));
    button.classList.add("is-active");
    document.getElementById(targetId).classList.add("is-active");
  });
});

function readConfig() {
  const apiBase = document.querySelector("#apiBase").value.replace(/\/$/, "");
  const apiKey = document.querySelector("#apiKey").value.trim();
  const headers = { "Content-Type": "application/json" };
  if (apiKey) headers["x-public-api-key"] = apiKey;
  return { apiBase, headers };
}

function formatMoney(value, currency, digits = 0) {
  if (!Number.isFinite(value)) return "-";
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(value);
}

function formatPercent(value) {
  if (!Number.isFinite(value)) return "-";
  const normalizedValue = Math.abs(value) <= 1 ? value * 100 : value;
  return `${normalizedValue.toFixed(1)}%`;
}

function toMinorUnits(amount) {
  return Math.round(Number(amount || 0) * 100);
}

async function postJson(endpoint, payload) {
  const { apiBase, headers } = readConfig();
  const normalizedBase = apiBase.replace(/\/api$/, "");
  const normalizedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const response = await fetch(`${normalizedBase}${normalizedEndpoint}`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  const json = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message =
      json?.error ||
      json?.message ||
      json?.details?.backend_raw_error ||
      `Request failed with ${response.status}`;
    throw new Error(message);
  }
  return json;
}

function renderPayrollCards(data, currency) {
  const result = data?.gesamt || data?.person1 || {};
  const gross = Number(result?.Brutto || 0) / 100;
  const net = Number(result?.NET || 0) / 100;
  const tax = Number(result?.ST || result?.LSTLZZ || 0) / 100;
  const social = Number(result?.ASV || result?.RSV || 0) / 100;

  const cards = [
    { label: "Gross", value: formatMoney(gross, currency) },
    { label: "Net", value: formatMoney(net, currency) },
    { label: "Tax", value: formatMoney(tax, currency) },
    { label: "Social contributions", value: formatMoney(social, currency) },
  ];

  payrollResult.innerHTML = cards
    .map(
      (card) => `
        <article class="result-card">
          <div class="label">${card.label}</div>
          <div class="value">${card.value}</div>
        </article>
      `,
    )
    .join("");
}

function renderCompareTable(data, currency) {
  const rows = Array.isArray(data?.results) ? [...data.results] : [];
  if (!rows.length) {
    compareResult.innerHTML = `<div class="empty-state">No comparison results returned.</div>`;
    return;
  }

  rows.sort((left, right) => Number(right.net || 0) - Number(left.net || 0));

  compareResult.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Country</th>
          <th>Net</th>
          <th>Tax</th>
          <th>Social</th>
          <th>Effective rate</th>
        </tr>
      </thead>
      <tbody>
        ${rows
          .map(
            (row) => `
              <tr>
                <td>${row.country}</td>
                <td>${formatMoney(Number(row.net || 0), currency.toUpperCase())}</td>
                <td>${formatMoney(Number(row.tax || 0), currency.toUpperCase())}</td>
                <td>${formatMoney(Number(row.social_contributions || 0), currency.toUpperCase())}</td>
                <td>${formatPercent(Number(row.effective_rate || 0))}</td>
              </tr>
            `,
          )
          .join("")}
      </tbody>
    </table>
  `;
}

async function runPayrollDemo() {
  payrollStatus.textContent = "Calculating payroll...";
  payrollResult.innerHTML = "";

  const form = new FormData(payrollForm);
  const country = String(form.get("country"));
  const annualGross = Number(form.get("annualGross"));
  const currency = String(form.get("currency"));
  const taxYear = Number(form.get("taxYear"));

  const payload = {
    Land: country,
    Stjahr: taxYear,
    Currency: currency,
    LZZ: 1,
    Modus: 1,
    Personen: [
      {
        Land: country,
        Gehalt_ct: toMinorUnits(annualGross),
        Gehalt_ct_ohne_Sonst: toMinorUnits(annualGross),
        Steuerklasse: 1,
        Geburtsjahr: 1990,
      },
    ],
  };

  try {
    const data = await postJson("/api/berechne", payload);
    payrollStatus.textContent = "Payroll result loaded.";
    renderPayrollCards(data, currency);
  } catch (error) {
    payrollStatus.innerHTML = `<div class="error-box">${error.message}</div>`;
  }
}

async function runCompareDemo() {
  compareStatus.textContent = "Comparing salaries...";
  compareResult.innerHTML = "";

  const form = new FormData(compareForm);
  const annualGross = Number(form.get("annualGross"));
  const currency = String(form.get("currency"));
  const taxYear = String(form.get("taxYear"));
  const countries = compareForm.querySelectorAll('input[name="countries"]:checked');
  const selectedCountries = Array.from(countries).map((entry) => entry.value);

  if (!selectedCountries.length) {
    compareStatus.innerHTML = `<div class="error-box">Select at least one country.</div>`;
    return;
  }

  const payload = {
    annual_gross: annualGross,
    tax_year: taxYear,
    countries: selectedCountries,
    currency,
  };

  try {
    const data = await postJson("/api/taxcompare", payload);
    compareStatus.textContent = "Salary comparison loaded.";
    renderCompareTable(data, currency);
  } catch (error) {
    compareStatus.innerHTML = `<div class="error-box">${error.message}</div>`;
  }
}

payrollForm.addEventListener("submit", (event) => {
  event.preventDefault();
  void runPayrollDemo();
});

compareForm.addEventListener("submit", (event) => {
  event.preventDefault();
  void runCompareDemo();
});

payrollSubmit?.addEventListener("click", () => {
  void runPayrollDemo();
});

compareSubmit?.addEventListener("click", () => {
  void runCompareDemo();
});
