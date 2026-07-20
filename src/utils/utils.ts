import CryptoJS from "crypto-js";
export function encrypt(val){
  return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Hex.parse( CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(val),CryptoJS.enc.Utf8.parse("uUXsN6okXYqsh0BB"),{mode:CryptoJS.mode.ECB,padding:CryptoJS.pad.Pkcs7}).ciphertext.toString()))
 ;
}

