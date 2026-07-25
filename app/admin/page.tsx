import type { Metadata } from "next";
import { chatGPTSignOutPath, requireChatGPTUser } from "../chatgpt-auth";
import { getEditorialDashboard, requireEditorialUser } from "../../db/editorial";
import { AdminWorkspace } from "./AdminWorkspace";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Editorial dashboard", robots: { index: false, follow: false } };

export default async function AdminPage() {
  const identity = await requireChatGPTUser("/admin");
  let editor;
  try {
    editor = await requireEditorialUser(identity);
  } catch {
    return <main className="access-denied"><p className="eyebrow">Restricted workspace</p><h1>Editorial access required</h1><p>Your identity is authenticated, but it has not been assigned an editorial role.</p><a className="button" href="/">Return to the public site</a></main>;
  }
  const dashboard = await getEditorialDashboard();
  return <main id="main" className="admin-shell">
    <aside className="admin-nav"><a className="brand inverse" href="/"><span>Q</span> Quotes<small>.org.in</small></a><p>Editorial workspace</p><nav aria-label="Editorial navigation"><a className="active" href="/admin">Overview</a><a href="#quotes">Quotations</a><a href="#new-quote">New draft</a><a href="#reports">Reports</a><a href="#audit">Audit log</a></nav><div className="admin-user"><strong>{identity.displayName}</strong><span>{editor.role}</span><a href={chatGPTSignOutPath("/")}>Sign out</a></div></aside>
    <AdminWorkspace initialQuotes={dashboard.quotes} initialReports={dashboard.reports} audit={dashboard.audit} counts={dashboard.counts} user={{displayName:identity.displayName,role:editor.role}} />
  </main>;
}
