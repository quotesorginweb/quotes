import { getChatGPTUser } from "../../../../../chatgpt-auth";
import { requireEditorialUser, reviewQuote } from "../../../../../../db/editorial";
export async function POST(request:Request,{params}:{params:Promise<{id:string}>}){
  const identity=await getChatGPTUser();if(!identity)return Response.json({error:"Authentication required"},{status:401});
  try{const reviewer=await requireEditorialUser(identity,["administrator","reviewer"]);const{id}=await params;const body=await request.json() as {action?:string;reason?:string};if(!["approve","reject","unpublish"].includes(body.action||"")||!body.reason?.trim())return Response.json({error:"A valid action and reason are required"},{status:400});await reviewQuote(id,body.action as "approve"|"reject"|"unpublish",body.reason.trim().slice(0,1000),reviewer);return Response.json({status:"ok"})}
  catch(error){const code=error instanceof Error?error.message:"Review failed";const friendly:Record<string,string>={PUBLICATION_CHECKS_FAILED:"Verification, rights, confidence or source checks have not passed",SECOND_REVIEWER_REQUIRED:"A different reviewer must approve this record",EDITORIAL_ACCESS_DENIED:"Reviewer access required"};return Response.json({error:friendly[code]||code},{status:code==="EDITORIAL_ACCESS_DENIED"?403:400})}
}
