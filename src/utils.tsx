

export function commify(value, decimals = 4) {
  if (value === null || value === undefined) return "0";

  // Convert value to a string safely
  let numStr = String(value); // Ensure it's a string

  // Handle scientific notation (e.g., 1.23e-10)
  if (numStr.includes("e") || numStr.includes("E")) {
      numStr = Number(numStr).toFixed(18).replace(/\.?0+$/, ""); // Convert to full decimal format
  }

  // Convert to fixed decimal places if decimals is provided
  if (decimals !== null) {
      numStr = Number(numStr).toFixed(decimals);
  }

  // Split into integer and decimal parts
  let [integerPart, decimalPart] = numStr.split(".");

  // Handle negative numbers
  let isNegative = integerPart.startsWith("-");
  if (isNegative) integerPart = integerPart.substring(1);

  // Add commas to the integer part
  integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  // Reattach the sign if negative
  let formattedNumber = isNegative ? "-" + integerPart : integerPart;

  // Append decimal part if present and decimals is not explicitly set to 0
  if (decimalPart !== undefined && decimals !== 0) {
      formattedNumber += "." + decimalPart;
  }

  return formattedNumber;
}

  // Generate a bytes32 string
export function generateBytes32String(text) {
  if (text.length > 32) {
      throw new Error("String exceeds 32 bytes");
  }

  // Convert the string to a UTF-8 encoded bytes array and pad it to 32 bytes
  const hex = Buffer.from(text, "utf8").toString("hex");
  return "0x" + hex.padEnd(64, "0"); // Ensure it's padded to 64 hex characters (32 bytes)
}

export function convertDaysToReadableFormat(days) {
  const totalMinutes = Math.floor(days * 24 * 60);
  const d = Math.floor(totalMinutes / (24 * 60));
  const h = Math.floor((totalMinutes % (24 * 60)) / 60);
  const m = totalMinutes % 60;

  return `${d} days, ${h} hours, ${m} min.`;
}

export function formatLargeNumber(num) {
    num = Number(num).toFixed(4); // Convert to number if it's not already

    if (num < 1000) {
        return num.toString(); // Convert the number to string for consistency
    }

    const units = ["K", "M", "B", "T"]; // Units for thousand, million, billion, trillion
    let unitIndex = -1; // To determine the right unit
    let scaledNum = num;

    while (scaledNum >= 1000 && unitIndex < units.length - 1) {
        scaledNum /= 1000; // Divide by 1000 until we find the appropriate unit
        unitIndex++;
    }

    // Formatting the number to one decimal place
    return `${scaledNum.toFixed(1)}${units[unitIndex]}`;
}