export function POST() {
  return Response.json({ error: "Editorial administration is not enabled." }, { status: 404 });
}
