import styles from '../../styles/Post.module.sass';
import PostContent from '../../components/PostContent';
import HeartButton from '../../components/HeartButton';
import AuthCheck from '../../components/AuthCheck';
import Metatags from '../../components/Metatags';
import { UserContext } from '../../lib/context';
import { firestore, getUserWithUsername, postToJSON } from '../../lib/firebase';
import { doc, getDocs, getDoc, collectionGroup, query, limit, getFirestore } from 'firebase/firestore';


import Link from 'next/link';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { useContext } from 'react';


export async function getStaticProps({ params }) {
  const { username, slug } = params;

  const userDoc = await getUserWithUsername(username);

  let post;
  let path;

  if (userDoc) {
    const postRef = doc(getFirestore(), userDoc.ref.path, 'posts', slug);
    post = postToJSON(await getDoc(postRef) );
    path = postRef.path;
  }

  return {
    props: { post, path },
    revalidate: 100,
  };
}

export async function getStaticPaths() {
  // Improve my using Admin SDK to select empty docs
  const q = query(
    collectionGroup(getFirestore(), 'posts'),
    limit(20)
  )
  const snapshot = await getDocs(q);
  const paths = snapshot.docs.map((d) => {
    const { slug, username } = d.data();
    const removeUndefined = { slug, username }
    return {
      params: JSON.parse(JSON.stringify(removeUndefined)),
    };
  });

  return {
    // must be in this format:
    // paths: [
    //   { params: { username, slug }}
    // ],
    paths,
    fallback: 'blocking',
  };
}

export default function Post(props) {
  const postRef = doc(getFirestore(), props.path);
  const [realtimePost] = useDocumentData(postRef);

  const post = realtimePost || props.post;

  const { user: currentUser } = useContext(UserContext);

  return (
    <main className={styles.container}>
      <Metatags title={post.title} description={post.title} />
      
      <section>
        <PostContent post={post} />
      </section>

      <aside className="card">
        <p>
          <strong>{post.heartCount || 0} 🤍</strong>
        </p>

        <AuthCheck
          fallback={
            <Link href="/enter" passHref>
              <button>💗 Sign Up</button>
            </Link>
          }
        >
          <HeartButton postRef={postRef} />
        </AuthCheck>

        {currentUser?.uid === post.uid && (
          <Link href={`/admin/${post.slug}`} passHref>
            <button>Edit Post</button>
          </Link>
        )}
      </aside>
    </main>
  );
}