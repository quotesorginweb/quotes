import { getChatGPTUser } from "../../../chatgpt-auth";
import { createDraft, requireEditorialUser } from "../../../../db/editorial";

const text = (value:unknown,max:number) => typeof value==="string" ? value.trim().slice(0,max) : "";
export async function POST(request:Request){
  const identity=await getChatGPTUser();if(!identity)return Response.json({error:"Authentication required"},{status:401});
  try{
    const editor=await requireEditorialUser(identity,["administrator","editor"]);
    const body=await request.json() as Record<string,unknown>;
    const input={text:text(body.text,1000),author:text(body.author,160),source:text(body.source,240),sourceUrl:text(body.sourceUrl,1000),sourceLocation:text(body.sourceLocation,240)};
    if(!input.text||!input.author||!input.source||!/^https?:\/\//i.test(input.sourceUrl))return Response.json({error:"Exact text, author, source and a valid source URL are required"},{status:400});
    const id=await createDraft(input,editor);return Response.json({id},{status:201});
  }catch(error){const message=error instanceof Error?error.message:"Unable to create draft";return Response.json({error:message==="DUPLICATE_QUOTE"?"A matching quotation already exists":message},{status:message==="EDITORIAL_ACCESS_DENIED"?403:400})}
}
