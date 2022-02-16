import Link from "next/link"
import Image from 'next/image'
import style from '../styles/Navbar.module.sass'

import { useContext } from "react";
import { UserContext } from "../lib/context";

export default function Navbar() {
  const { user, username} = useContext(UserContext);

  return (
    <nav className={style.navbar}>
      <ul>
        <li>
          <Link href="/" passHref>
            <button>Message Feed</button>
          </Link>
        </li>
        {/* user is signed in and has username. */}
        {username && (
          <>
            <li>
              <Link href="/admin" passHref>
                <button>Admin Page</button>
              </Link>
            </li>
            <li>
              <Link href={`/${username}`} passHref>
                <Image 
                  alt="User Profile Photo" 
                  src={user?.photoURL} 
                  width='48' height='48'
                />
              </Link>
            </li>
          </>
        )}

        {/* user is not signed or hasn't made an account. */}
        {!username && (
          <li>
            <Link href="/enter" passHref>
              <button className="login-btn">Log in</button>
            </Link>
          </li>
          )}
      </ul>
    </nav> 
  )
}