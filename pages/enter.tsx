import Image from 'next/image'
import { useContext, useState, useEffect, useCallback } from 'react'
import debounce from 'lodash.debounce'
import kebabcase from 'lodash.kebabcase'
// Firebase Imports
import { signInWithPopup, signOut } from 'firebase/auth'
import { 
	doc, 
	writeBatch, 
	getDoc, 
	getFirestore, 
	DocumentReference, 
	WriteBatch, 
	DocumentSnapshot, 
	DocumentData 
} from 'firebase/firestore'

// Custom Imports
import { UserContext } from '../lib/context'
import { auth, googleAuthProvider, twitterAuthProvider } from "../lib/firebase"

export default function EnterPage(props) {
	const {user, username} = useContext(UserContext)
	// ??:: is a design pattern
  return (
	<main className="username-card">
		{user ? <SignOutButton /> : <SignInButtons />}
	</main>
  )
}

/**
 * Sign in with Google Button
 * @returns - Button that begins google authentication
 */
const SignInButtons = (): JSX.Element => {
	const signInWithGoogle = async () => {
		await signInWithPopup(auth,googleAuthProvider)
	}
	const signInWithTwitter = async () => {
		await signInWithPopup(auth,twitterAuthProvider)

	}
	return(
		<>
			<button className="btn-google" onClick={signInWithGoogle}>
				<Image alt="button google signin" src={'/google.png'} width='48' height='48'/> Sign in with Google
			</button>
			<button className="btn-twitter" onClick={signInWithTwitter}>
				<Image alt="button twitter signin" src={'/twitter.png'} width='48' height='48'/> Sign in with Twitter
			</button>
		</>
	)
}


/**
 * Sign Out button
 * @returns - Button to sign out of auth state
 */
const SignOutButton = (): JSX.Element =>{
	return <button onClick={() => signOut(auth)}>Sign Out</button>
}

function UsernameMessage({ username, isValid, loading}){
	if (loading) {
		return <p>Checking...</p>
	} else if (isValid) {
		return <p className="text-success"> {username} is available! </p>
	} else if (username && !isValid) {
		return <p className="text-danger">That username is taken!</p>
	} else {
		return <p></p>
	}
}
/**
 * Component that prompts user for username ensuring character 
 * constraint and uniquness 
 * @returns { JSX.Element } - <Form><h3><input><button></Form>
 */
const UsernameForm = (): JSX.Element => {
	const [formValue, setFormValue] = useState('')
	const [isValid, setIsValid] = useState(false)
	const [loading, setLoading] = useState(false)

	const { user, username } = useContext(UserContext)

	const onChange = (e) => {
		//must be formatted correctly
		const val:string = kebabcase(e.target.value.toLowerCase())
		const re:RegExp = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

		if (val.length < 3){
			setFormValue(val)
			setLoading(false)
			setIsValid(false)
		}
		if (re.test(val)){
			setFormValue(val)
			setLoading(true)
			setIsValid(false)
		}
	}
	const onSubmit = async (e) => {
		e.preventDefault(); // Prevent page refresh by default

		// Create refs for both documents
		const userDoc:DocumentReference = doc(getFirestore(), 'users', user.uid)
		const usernameDoc:DocumentReference = doc(getFirestore(),'usernames', formValue)

		// Commit both docs together as a batch write
		const batch:WriteBatch = writeBatch(getFirestore())
		batch.set(userDoc, { username: formValue, photoURL: user.photoURL,
							 displayName: user.displayName })
		batch.set(usernameDoc, { uid: user.uid })

		await batch.commit();
	} 

	useEffect(() =>{
		checkUsername(formValue)
	},[formValue])

	// Hit the database for username match after each debounced change
	// useCallback is required for debounce to work
	const checkUsername = useCallback(
		debounce(async (un:string) => {
			if (un.length >= 3) {
				const ref:DocumentReference = doc(getFirestore(), 'usernames', un);
				const snap:DocumentSnapshot<DocumentData> = await getDoc(ref);
				//console.log('Firestore read executed!', snap.exists());
				setIsValid(!snap.exists());
				setLoading(false);
			}
		}, 500),
		[]
	);
	/**
	 * Useful dom elements for debugging 
	 * @returns {JSX.Element}
	 */
	const debug = (uname,l,v): JSX.Element => {
		// copy -> paste {debug(formValue,loading,isValid)}
		return(
			<div className="anonDebug">
				<h3>Debug State</h3>
				Username: {uname}
				<br />
				Loading: {l.toString()}
				<br />
				Username Valid: {v.toString()}
			</div>
		)
	}

	return (
		!username && (
				<form onSubmit={onSubmit}>
					<h3>Choose Username</h3>
					<input name="username" placeholder="username" value={formValue} onChange={onChange} />
					<UsernameMessage username={formValue} isValid={isValid} loading={loading} />
					<button type="submit" className="temp" disabled={!isValid}>
						Choose
					</button>
				</form>)
	)
}