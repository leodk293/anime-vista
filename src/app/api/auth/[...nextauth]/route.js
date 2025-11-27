import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import User from "@/lib/models/users";
import { connectMongoDB } from "@/lib/db/connectMongoDb";

const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    callbacks: {
        async signIn({ user, account }) {
            if (account.provider !== "google") {
                return true;
            }

            const { name, email, image } = user;
            const avatarUrl = image;

            try {
                await connectMongoDB();
                const existingUser = await User.findOne({ email });

                if (existingUser) {
                    const updates = {};
                    if (existingUser.fullName !== name) {
                        updates.fullName = name;
                    }
                    if (avatarUrl && existingUser.avatarUrl !== avatarUrl) {
                        updates.avatarUrl = avatarUrl;
                    }
                    if (Object.keys(updates).length > 0) {
                        await User.findByIdAndUpdate(existingUser._id, updates);
                    }
                } else {
                    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/users`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            fullName: name,
                            email,
                            avatarUrl,
                        }),
                    });
                    if (!res.ok) {
                        throw new Error("Failed to create user in the database");
                    }
                }
                return true;
            } catch (error) {
                console.error("Authentication error:", error);
                return false;
            }
        },

        async session({ session }) {
            if (session.user?.email) {
                try {
                    await connectMongoDB();
                    const dbUser = await User.findOne({ email: session.user.email });
                    if (dbUser) {
                        session.user.id = dbUser._id.toString();
                        session.user.avatarUrl = dbUser.avatarUrl;
                    }
                } catch (error) {
                    console.error("Session error:", error);
                }
            }
            return session;
        },
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
