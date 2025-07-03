import { createContext, useContext, useEffect, useState } from "react";
import { auth,googleProvider,githubProvider,db } from "../Firebase.js";
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { signInWithPopup, signOut, onAuthStateChanged,updateProfile, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

const AuthContext = createContext();

export const useAuth = ()=> useContext(AuthContext)

export const AuthProvider = ({children})=>{
    const [user,setUser] = useState(null);
    const [loading,setLoading] = useState(true)
    const createUserIfNotExists = async (user) => {
  const ref = doc(db, 'users', user.uid);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) {
    await setDoc(ref, {
      email: user.email,
      createdAt: new Date(),
    });
  }
};

    useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth,(firebaseUser)=>{
            setUser(firebaseUser||null)
            setLoading(false)
            if (firebaseUser) {
  setUser(firebaseUser);
  createUserIfNotExists(firebaseUser);
}
        })
        return () => unsubscribe()
    },[])

    const loginWithGoogle = async()=> {
        const result = await signInWithPopup(auth,googleProvider)
        const user = result.user

        const userRef =doc(db,'users',user.uid)
        const snapshot = await getDoc(userRef)

        if(!snapshot.exists() || !snapshot.data().nickname){
            const nickname = user.displayName
            await setDoc(userRef,{nickname},{merge:true})
        }
    }
    const loginWithGitHub = async()=> {
        const result = await signInWithPopup(auth,githubProvider)
        const user = result.user

        const userRef =doc(db,'users',user.uid)
        const snapshot = await getDoc(userRef)

        if(!snapshot.exists() || !snapshot.data().nickname){
            const nickname = user.reloadUserInfo?.screenName || user.displayName;
            await setDoc(userRef,{nickname},{merge:true})
        }
    }
    const signup = async(email,password,name)=> {
       const userCred =  createUserWithEmailAndPassword(auth,email,password)
        const user = userCred.user
        await updateProfile(user,{displayName:name})
        
        await setDoc(doc(db,'users',user.uid),{
            nickname: name,
            email:user.email,
        }, {merge:true})
        return userCred
    }
    const login = (email, password) => signInWithEmailAndPassword(auth, email, password);
    const logout = ()=> signOut(auth);
    return(
        <AuthContext.Provider 
            value={{
                user,
                loading,
                signup,
                login,
                loginWithGitHub,
                loginWithGoogle,
                logout,
            }}
        >
            {!loading && children}
        </AuthContext.Provider>
    )
}