import React from "react"
import { Html, Head } from "@react-email/components"
import styles from "./styles"

export function EmailBase({
  Main,
  Footer,
  subject = "System Message"
}:{
  Main: React.JSX.Element
  Footer?: React.JSX.Element
  subject: string
}) {

  return (
    <Html lang="en" dir="ltr">
      <Head>
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>{subject}</title>
      </Head>
      <body style={styles.body}>
        <main style={styles.main}>
          {Main}
        </main>
        <footer>
          {Footer ? Footer : ""}
          <p>
            <center>
              <small>
                <i>
                  We will never ask you for your password.
                </i>
              </small>
            </center>
          </p>
        </footer>
      </body>
    </Html>
  )
}