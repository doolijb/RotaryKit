import crypto from "crypto"

/**
 * Encrypts a passphrase using PBKDF2
 * 
 * @param passphrase The passphrase to encrypt
 * @param salt The salt to use
 * @param iterations The number of iterations to use
 */
export function encrypt({
    passphrase, salt, iterations
}: {
    passphrase: string, salt: string, iterations: number
}): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        crypto.pbkdf2(
          passphrase,
          // We use SECRET_SALT here so some aspect of the salt always comes from the environment 
          // and not the database
          salt + process.env.SECRET_SALT,
          iterations,
          256,
          "sha256",
          (err, derivedKey) => {
            if (err) {
              reject(err)
            } else {
              resolve(derivedKey.toString("hex"))
            }
          }
        )
      })
}