import { query, collection, where, getDocs, limit, orderBy, getFirestore } from 'firebase/firestore';

import { getUserWithUsername, postToJSON } from '../../lib/firebase';
import UserProfile from '../../components/UserProfile'
import Metatags from '../../components/Metatags'
import PostFeed from '../../components/PostFeed'


export async function getServerSideProps({query: urlQuery}) {
  const { username } = urlQuery
  const userDoc = await getUserWithUsername(username);


  if(!userDoc){
    return{
      notFound:true
    }
  }

  // JSON serializable data
  let user = null
  let posts = null

  if (userDoc) {
    user = userDoc.data()
    const postsQuery = query(
      collection(getFirestore(), userDoc.ref.path, 'posts'),
      where('published', '==', true),
      orderBy('createdAt', 'desc'),
      limit(5)
    )
    posts = (await getDocs(postsQuery)).docs.map(postToJSON)
  }

  return {
    props: { user, posts }, // will be passed to the page component as props
  }
}

export default function UserProfilePage({ user, posts}) {
  return (
    <main className="flexColumn">
      <Metatags title={user?.username} description={`${user?.username}'s public profile'`} />
      <UserProfile user={user} />
      <PostFeed posts={posts} admin={false} />
    </main>
  )
}