import axios from "axios";
import { format } from "date-fns";

export const fetchCodeforcesActivity = async(username)=>{
    try {
        const res = await axios.get(`https://codeforces.com/api/user.status?handle=${username}`)
        const submissions = res.data.result

        const activity = submissions.filter(submission => submission.problem && submission.creationTimeSeconds).map((submission)=>{
            const {problem} = submission.problem || {}
            const date = format(new Date(submission.creationTimeSeconds*1000),'yyyy-MM-dd')

            return {
                platform:'CodeForces',
                title:`${problem.index}. ${problem.name}`,
                contestId:problem.contestId,
                index:problem.index,
                date,
                source:'sync',
                verdict:submission.verdict,
                url:`https://codeforces.com/contest/${problem.contestId}/problem/${problem.index}`
            }
        })
        return activity
    } catch (error) {
        console.error('CodeForces Activity Fetch Error:', error.message);
        return []
    }
}