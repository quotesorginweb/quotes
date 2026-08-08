export function POST() {
  return Response.json(
    { error: "Online report storage is not enabled. Use the email reporting form." },
    { status: 503 },
  );
}
