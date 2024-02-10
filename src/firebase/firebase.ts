import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import {
    getAuth,
    onAuthStateChanged,
    signOut,
    signInWithEmailAndPassword,
    NextOrObserver,
    User,
    UserCredential,
    Unsubscribe
} from 'firebase/auth';
import {getFirebaseConfig} from './firebase-config';

const app = firebase.initializeApp(getFirebaseConfig());
export const auth = getAuth(app);
export const db = firebase.firestore();

export const signInUser = async (
    email: string,
    password: string
): Promise<void | UserCredential> => {
    if (!email && !password) return;

    return await signInWithEmailAndPassword(auth, email, password);
};

export const userStateListener = (
    callback: NextOrObserver<User>
): Unsubscribe => {
    return onAuthStateChanged(auth, callback);
};

export const SignOutUser = async (): Promise<void> => await signOut(auth);
