import Link from 'next/link'
import styles from '../styles/PostFeed.module.sass'

export default function PostFeed({ posts, admin}) {
    return posts ? posts.map((post)=> <PostItem post={post} key={post.slug} admin={admin} />) : null ;
}

const PostItem = ({ post, admin = false}) => {
    // calc word count and read time
    const wordCount = post?.content.trim().split(/\s+/g).length
    const minutesToRead = (wordCount / 100 + 1).toFixed(0)

    return(
        <div className={styles.card}>
            <Link href={`/${post.username}/${post.slug}`} passHref>
                <h2>
                <a>{post.title}</a>
                </h2>
            </Link>
            <Link href={`/${post.username}`} passHref>
                <strong>By <a>@{post.username}</a></strong>
            </Link>
            <footer>
                <span>{wordCount} words. {minutesToRead} min read</span>
                <span className="push-left"> 💗 {post.heartCount || 0} Hearts</span>
            </footer>
            {/* If admin view, show extra controls for user */}
            {admin && (
                <section className={styles.liveFormatting}>
                    <Link href={`/admin/${post.slug}`} passHref>
                            <button>Edit</button>
                    </Link>
                    <p>Status: {post.published ? 'Live' : 'Unpublished'}</p>
                </section>
            )}
        </div>
        )
}