import { NextResponse } from "next/server";
import axios from "axios";

export async function GET() {
  try {
    // Make a request using axios
    const response = await axios.get(
      "https://jsonplaceholder.typicode.com/todos/1",
    );

    // Log the result
    console.log("Axios request result:", response.data);

    // Return true
    return NextResponse.json(
      { success: true, data: response.data },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to make axios request", success: false },
      { status: 500 },
    );
  }
}
