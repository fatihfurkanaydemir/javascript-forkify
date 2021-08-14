import { TIMEOUT_SEC } from './config';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const toFraction = function (number) {
  if (Number.isInteger(number)) return `${number}`;

  if (parseFloat(number) === parseInt(number)) {
    return number;
  }
  var gcd = function (a, b) {
    if (b < 0.0000001) {
      return a;
    }
    return gcd(b, Math.floor(a % b));
  };
  var len = number.toString().length - 2;
  var denominator = Math.pow(10, len);
  var numerator = number * denominator;
  var divisor = gcd(numerator, denominator);
  numerator /= divisor;
  denominator /= divisor;
  var base = 0;

  if (numerator > denominator) {
    base = Math.floor(numerator / denominator);
    numerator -= base * denominator;
  }
  number = Math.floor(numerator) + '/' + Math.floor(denominator);
  if (base) {
    number = base + ' ' + number;
  }
  return number;
};

export const AJAX = async function (url, uploadData = undefined) {
  const fetchPromise = uploadData
    ? fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(uploadData),
      })
    : fetch(url);

  try {
    const res = await Promise.race([fetchPromise, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);

    return data;
  } catch (err) {
    throw err;
  }
};
