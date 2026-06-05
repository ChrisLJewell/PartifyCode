import Papa from "https://esm.sh/papaparse";

const yearSelect = document.getElementById("year_select");
const makeSelect = document.getElementById("make_select");
const modelSelect = document.getElementById("model_select");
const productTypeSelect = document.getElementById("product_type_select");
const searchBtn = document.getElementById("search_btn");

let parts = [];

// Load CSV
Papa.parse("Partify.csv", {
    download: true,
    header: true,
    complete: function (results) {
        parts = results.data;

        // Fill Year dropdown
        const years = [...new Set(parts.map(r => r.Year.trim()))].reverse();
        years.forEach(year => {
            if (year) {
                const opt = document.createElement("option");
                opt.value = year;
                opt.textContent = year;
                yearSelect.appendChild(opt);
            }
        });
    }
});

// YEAR to MAKE
yearSelect.addEventListener("change", () => {
    const year = yearSelect.value;

    makeSelect.disabled = false;
    modelSelect.disabled = true;
    productTypeSelect.disabled = true;
    searchBtn.disabled = true;

    makeSelect.innerHTML = `<option value="">Make</option>`;
    modelSelect.innerHTML = `<option value="">Model</option>`;
    productTypeSelect.innerHTML = `<option value="">Product Type</option>`;

    const makes = [
        ...new Set(parts.filter(r => r.Year === year).map(r => r.Make))
    ];

    makes.forEach(make => {
        if (make) {
            const opt = document.createElement("option");
            opt.value = make;
            opt.textContent = make;
            makeSelect.appendChild(opt);
        }
    });
});

// MAKE to MODEL
makeSelect.addEventListener("change", () => {
    const year = yearSelect.value;
    const make = makeSelect.value;

    modelSelect.disabled = false;
    productTypeSelect.disabled = true;
    searchBtn.disabled = true;

    modelSelect.innerHTML = `<option value="">Model</option>`;
    productTypeSelect.innerHTML = `<option value="">Product Type</option>`;

    const models = [
        ...new Set(
            parts
                .filter(r => r.Year === year && r.Make === make)
                .map(r => r.Model)
        )
    ];

    models.forEach(model => {
        if (model) {
            const opt = document.createElement("option");
            opt.value = model;
            opt.textContent = model;
            modelSelect.appendChild(opt);
        }
    });
});

// MODEL to PRODUCT TYPE
modelSelect.addEventListener("change", () => {
    const year = yearSelect.value;
    const make = makeSelect.value;
    const model = modelSelect.value;

    productTypeSelect.disabled = false;
    searchBtn.disabled = true;

    productTypeSelect.innerHTML = `<option value="">Product Type</option>`;

    const types = [
        ...new Set(
            parts
                .filter(r => r.Year === year && r.Make === make && r.Model === model)
                .map(r => r["Product Type"])
        )
    ];

    console.log(Object.keys(parts[0]));


    types.forEach(type => {
        if (type) {
            const opt = document.createElement("option");
            opt.value = type;
            opt.textContent = type;
            productTypeSelect.appendChild(opt);
        }
    });
});

// PRODUCT TYPE to ENABLE SEARCH
productTypeSelect.addEventListener("change", () => {
    searchBtn.disabled = productTypeSelect.value === "";
});

// SEARCH BUTTON to REDIRECT
searchBtn.addEventListener("click", () => {
    const year = yearSelect.value;
    const make = makeSelect.value;
    const model = modelSelect.value;
    const type = productTypeSelect.value;

    //  Shopify URL
    const url = `https://partifyusa.com/collections/${year}-${make}-${model}?filter.p.product_type=${encodeURIComponent(type)}`;

    window.location.href = url;
});
