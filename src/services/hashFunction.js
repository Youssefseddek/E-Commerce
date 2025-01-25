import bcrypt from 'bcryptjs'


export function hashFunction(data) {
    const hashedData = bcrypt.hashSync(data, +process.env.saltRound)
    return hashedData
}