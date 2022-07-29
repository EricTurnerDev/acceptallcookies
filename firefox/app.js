/**
 * CSS selectors that are used across multiple websites.
 */
const defaultCssSelectors = [
    '.accept-all-cookies',
    '#onetrust-accept-btn-handler',
    '#hs-eu-confirmation-button'
];

/**
 * CSS selectors specific to each website.
 */
const cssSelectorsByDomain = {
    'com': {
        'accuweather': '.policy-accept',
        'ampersandtable': '.cky-btn-accept',
        'economist': '.sp_choice_type_11',
        'globo': '.cookie-banner-lgpd_accept-button',
        'latimes': '#ensCloseBanner',
        'novaramedia': '#gdpr-accept',
        'plesk': '.ch2-allow-all-btn',
        'samsung': '[an-ac="cookie bar:accept"]',
        'similarweb': '.cookies-notification__dismiss',
        'sisyphus-industries': '#cn-accept-cookie',
        'stackoverflow': '.js-accept-cookies',
        'urologytimes': '.osano-cm-accept',
        'weather': '[class*="PrivacyDataNotice--closeButton"]' // TODO: element found, but click() isn't working
    },
    'us': {
        'zoom': '.onetrust-close-btn-handler'
    }
};

/**
 * Gets the CSS selectors used to find the button for accepting cookies for a website.
 *
 * @returns An array of CSS selectors to try
 */
function getCssSelectors(hostname, cssSelectors, defaultCssSelectors) {
    let s = cssSelectors;
    const hostnameParts = hostname.split('.').reverse();
    for (const p of hostnameParts) {
        s = s[p];
        if (typeof s !== "object") {
            break;
        }
    }
    if (typeof s === "string") {
        return [s];
    } else {
        return defaultCssSelectors;
    }
}

/**
 * Calls a function fn maxTimes number of times, waiting approximately delayMs between each call.
 *
 * If fn returns a truthy value then repeat stops calling fn.
 */
function repeat(fn, delayMs = 500, maxTimes = 10) {
    let times = 0;
    let completed = false;
    const intervalId = setInterval(() => {
        if (times < maxTimes && !completed) {
            try {
                completed = fn();
            } catch (e) {
                console.error(e);
            }
            times++;
        } else {
            clearInterval(intervalId);
        }
    }, delayMs);
}

/**
 * Finds and clicks the elements that match the CSS selector.
 *
 * Returns true if the element was found, false otherwise.
 */
function findAndClick(cssSelector) {
    const elements = document.querySelectorAll(cssSelector);
    const elementFound = elements.length > 0;
    for (let i = 0; i < elements.length; i++) {
        if (elements[i].click) {
            elements[i].click();
        } else {
            elements[i].dispatchEvent(new Event('click'));
        }
    }
    return elementFound;
}

function acceptAllCookies(cssSelectors=[]) {
    if (cssSelectors.length > 0) {
        // Try multiple times because the elements may be added to the DOM at any point after the page loads.
        repeat(() => {
            let found = false;
            for (let i = 0; i < cssSelectors.length; i++) {
                found = findAndClick(cssSelectors);
                if (found) {
                    break;
                }
            }
            return found; // Causes repeat() to stop if a button was found.
        });
    }
}

const cssSelectors = getCssSelectors(window.location.hostname, cssSelectorsByDomain, defaultCssSelectors);
console.log(cssSelectors);
acceptAllCookies(cssSelectors);
