import { NextResponse } from "next/server";
import User from "@/lib/models/users";
import { connectMongoDB } from "@/lib/db/connectMongoDb";

export const GET = async (request) => {
    try {
        const { searchParams } = new URL(request.url);
        const email = searchParams.get('email');

        if (!email) {
            return NextResponse.json({ message: "Email parameter is required" }, { status: 400 });
        }

        await connectMongoDB();
        const isUserExists = await User.findOne({ email });

        if (!isUserExists) {
            return NextResponse.json({ message: "User doesn't exist", exists: false });
        } else {
            return NextResponse.json({ message: "User exists", exists: true });
        }

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Failed to check user existence" }, { status: 500 });
    }
}