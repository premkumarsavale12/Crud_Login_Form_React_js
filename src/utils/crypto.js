import CryptoJS from 'crypto-js'

// Demo secret key (for production store this on server)
const SECRET_KEY = 'MY_SUPER_SECRET_KEY_123!'

export function encryptObject(obj) {
  const text = JSON.stringify(obj)
  return CryptoJS.AES.encrypt(text, SECRET_KEY).toString()
}

export function decryptToObject(ciphertext) {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY)
    const decrypted = bytes.toString(CryptoJS.enc.Utf8)
    if (!decrypted) return null
    return JSON.parse(decrypted)
  } catch (e) {
    console.error('Decrypt error', e)
    return null
  }
}
