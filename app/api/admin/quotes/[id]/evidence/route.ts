import { getChatGPTUser } from "../../../../../chatgpt-auth";
import { requireEditorialUser, verifyEvidence } from "../../../../../../db/editorial";
export async function POST(request:Request,{params}:{params:Promise<{id:string}>}){
  const identity=await getChatGPTUser();if(!identity)return Response.json({error:"Authentication required"},{status:401});
  try{const reviewer=await requireEditorialUser(identity,["administrator","reviewer"]);const{id}=await params;const body=await request.json() as {verification?:string;rights?:string;confidence?:number;note?:string};if(!["verified-primary-source","verified-reliable-secondary-source"].includes(body.verification||"")||!["public-domain","licensed"].includes(body.rights||"")||typeof body.confidence!=="number"||!body.note?.trim())return Response.json({error:"Verification, rights, confidence and an evidence note are required"},{status:400});await verifyEvidence(id,{verification:body.verification as "verified-primary-source"|"verified-reliable-secondary-source",rights:body.rights as "public-domain"|"licensed",confidence:body.confidence,note:body.note.trim().slice(0,2000)},reviewer);return Response.json({status:"verified"})}
  catch(error){const message=error instanceof Error?error.message:"Evidence review failed";return Response.json({error:message},{status:message==="EDITORIAL_ACCESS_DENIED"?403:400})}
}
