import {useAuth} from '../context/AuthContext'
import { useState,useEffect } from 'react'
import { doc,getDoc } from 'firebase/firestore'
import { db } from '../Firebase'

const useUserSettings = ()=>{
    const {user} = useAuth()
    const [setting,setSetting] = useState({})
    const [loading,setLoading] = useState(true)
    const [error,setError] = useState(false)

    useEffect(() => {
      const fetchSettings = async()=>{
        if(!user){
            setLoading(false)
            return
        }
        try {
            const docRef = doc(db,'users',user.uid)
            const snapshot = await getDoc(docRef)
            if(snapshot.exists()){
                setSetting(snapshot.data())
            } else{
                setSetting({})
            }
        } catch (error) {
            setError(error.message)
        } finally{
            setLoading(false)
        }
      }

      fetchSettings()
    }, [user])


    return {
        setting,
        loading,
        error,
        nickname: setting?.nickname||'',
        dailyGoal:setting?.dailyGoal||1,
        platforms:setting?.platforms||{},
        usernames:setting?.usernames||{},   
    }
}

export default useUserSettings