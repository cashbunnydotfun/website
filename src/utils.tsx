

export const commify = (number) => {
  if (number === undefined) return "";
    let numStr = number.toString();
    let [integerPart, decimalPart] = numStr.split(".");
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return decimalPart ? `${integerPart}.${decimalPart}` : integerPart;
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
