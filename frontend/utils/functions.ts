import {v4 as uuidv4} from 'uuid'
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
export function generateUUID() : string{
    return uuidv4();
}
export function generateOtpExpiry(){
  return new Date(Date.now() + 5*60*1000);
}

export function getGuestId(length = 6) {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
        const index = Math.floor(Math.random() * characters.length);
        otp += characters[index];
    }
    return otp;
}