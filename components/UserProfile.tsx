// UI component for user profile
import { loadStaticPaths } from "next/dist/server/dev/static-paths-worker";
import Image from "next/image";
import styles from '../styles/UserProfile.module.sass'
import {startCase, toLower} from 'lodash'

export default function UserProfile({ user }) {
    return (
      <div className={styles.boxCenter}>
        <Image className={styles.profileImg} alt={user?.photoURL?"User Profile Photo":"Anonymous Profile"} src={user?.photoURL || '/google.png'} width={100} height={100}/>
        <p>
          <i>@{user?.username}</i>
        </p>
        <h2>{user?.displayName ? startCase(toLower(user.displayName)) : 'Anonymous User'}</h2>
      </div>
    );
  }