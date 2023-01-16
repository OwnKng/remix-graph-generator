import type { MetaFunction } from "@remix-run/node"
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react"
import Select from "./components/Select"
import styles from "./styles/app.css"

export function links() {
  return [{ rel: "stylesheet", href: styles }]
}

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
})

export default function App() {
  return (
    <html lang='en'>
      <head>
        <Meta />
        <Links />
      </head>
      <body className='bg-bg'>
        <main>
          <div className='flex flex-col items-center w-full'>
            <div className='flex flex-col gap-8 py-4 w-full max-w-[720px]'>
              <h1 className='text-white text-3xl font-bold uppercase'>
                Graph Creator
              </h1>
              <Select />
            </div>
          </div>
          <div className='flex w-full py-4 items-center justify-center min-[450px] shadow bg-fg'>
            <Outlet />
          </div>
        </main>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
