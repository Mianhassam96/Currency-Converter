// Select DOM elements
const amountInput = document.querySelector('.amount input');
const fromCurrencySelect = document.querySelector('.from select');
const toCurrencySelect = document.querySelector('.to select');
const fromFlag = document.querySelector('.from img');
const toFlag = document.querySelector('.to img');
const swapIcon = document.querySelector('.fa-arrow-right-arrow-left');
const exchangeMessage = document.querySelector('.msg');
const convertButton = document.querySelector('button');

// Base API URL
const apiBaseUrl = 'https://api.exchangerate-api.com/v4/latest/';

// Function to fetch exchange rate
async function fetchExchangeRate(from, to) {
    try {
        const response = await fetch(`${apiBaseUrl}${from}`);
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }
        const data = await response.json();

        if (data.rates[to]) {
            return data.rates[to];
        } else {
            throw new Error('Target currency not found.');
        }
    } catch (error) {
        console.error('Error fetching exchange rate:', error.message);
        exchangeMessage.textContent = 'Unable to fetch exchange rate. Please try again.';
        return null;
    }
}

// Function to update flags based on the selected currency
function updateFlags() {
    const fromCurrency = fromCurrencySelect.value.toLowerCase();
    const toCurrency = toCurrencySelect.value.toLowerCase();

    fromFlag.src = `https://flagsapi.com/${fromCurrency.slice(0, 2).toUpperCase()}/flat/64.png`;
    toFlag.src = `https://flagsapi.com/${toCurrency.slice(0, 2).toUpperCase()}/flat/64.png`;
}

// Function to update the exchange rate message
async function updateExchangeRate() {
    const fromCurrency = fromCurrencySelect.value;
    const toCurrency = toCurrencySelect.value;

    if (fromCurrency === toCurrency) {
        exchangeMessage.textContent = `1 ${fromCurrency} = 1 ${toCurrency}`;
        return;
    }

    const rate = await fetchExchangeRate(fromCurrency, toCurrency);

    if (rate) {
        exchangeMessage.textContent = `1 ${fromCurrency} = ${rate.toFixed(2)} ${toCurrency}`;
    }

    updateFlags();
}

// Function to convert currency
async function convertCurrency() {
    const fromCurrency = fromCurrencySelect.value;
    const toCurrency = toCurrencySelect.value;
    const amount = parseFloat(amountInput.value);

    if (isNaN(amount) || amount <= 0) {
        exchangeMessage.textContent = 'Please enter a valid amount.';
        return;
    }

    const rate = await fetchExchangeRate(fromCurrency, toCurrency);

    if (rate) {
        const convertedAmount = amount * rate;
        exchangeMessage.textContent = `${amount} ${fromCurrency} = ${convertedAmount.toFixed(2)} ${toCurrency}`;
    }
}

// Function to swap currencies
function swapCurrencies() {
    const temp = fromCurrencySelect.value;
    fromCurrencySelect.value = toCurrencySelect.value;
    toCurrencySelect.value = temp;
    updateExchangeRate();
}

// Event Listeners
convertButton.addEventListener('click', (e) => {
    e.preventDefault();
    convertCurrency();
});

swapIcon.addEventListener('click', swapCurrencies);

fromCurrencySelect.addEventListener('change', updateExchangeRate);
toCurrencySelect.addEventListener('change', updateExchangeRate);

// Initial setup
updateExchangeRate();
