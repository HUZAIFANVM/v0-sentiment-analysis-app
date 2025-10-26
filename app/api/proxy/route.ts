// This allows the frontend to communicate with the FastAPI backend

export async function POST(request: Request) {
  const { path, body } = await request.json()

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

  try {
    const response = await fetch(`${apiUrl}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`)
    }

    const data = await response.json()
    return Response.json(data)
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}
