import { doc,updateDoc,getDoc } from "firebase/firestore";
import { db } from "../Firebase";

export const resetSyncedLogs = async(uid,platform)=>{
    const ref = doc(db,'users',uid)
    const snap = await getDoc(ref)
    const log = snap.data()?.activityLog || {}
    const cleanLog = {}

    for(const [date,entries] of Object.entries(log)){
        const filtered = entries.filter(entry =>{

            return entry.source === 'manual' || entry.platform?.toLowerCase() !== platform.toLowerCase()
        });
        console.log('🧹 Filtering logs for:', platform);
        if(filtered.length){
            cleanLog[date] = filtered
        }
    }
    await updateDoc(ref,{activityLog : cleanLog})
}