import express from "express";
import session from "express-session";
import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5001;

app.use(
    cors({
        origin: [
            "http://localhost:3001",
            "http://localhost:5173",
            "http://localhost:5173",
        ],
        credentials: true,
    })
);
app.use(express.json());
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
    })
);
app.use(passport.initialize());
app.use(passport.session());

passport.use(
    new GoogleStrategy.Strategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
        },
        (accessToken, refreshToken, profile, done) => {
            return done(null, profile);
        }
    )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

app.get("/", (req, res) => {
    // Check if this is an OAuth callback
    if (req.query.code) {
        // This is the OAuth callback
        passport.authenticate("google", {
            failureRedirect: "http://localhost:5173",
        })(req, res, () => {
            // Save user profile in session
            if (req.user) {
                req.session.user = {
                    email:
                        req.user.emails &&
                        req.user.emails[0] &&
                        req.user.emails[0].value,
                    name: req.user.displayName,
                    picture:
                        req.user.photos &&
                        req.user.photos[0] &&
                        req.user.photos[0].value,
                    role: "GoogleUser",
                };
                console.log(
                    "Root OAuth callback - user authenticated:",
                    req.session.user.email
                );

                // Save session and redirect to frontend
                req.session.save((err) => {
                    if (err) console.error("Session save error:", err);
                    res.redirect("http://localhost:5173");
                });
            } else {
                console.log("Root OAuth callback - no user");
                res.redirect("http://localhost:5173");
            }
        });
    } else {
        // Regular root access - redirect to frontend
        res.redirect("http://localhost:5173");
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
app.get("/auth/user", (req, res) => {
    if (req.session && req.session.user) {
        res.json(req.session.user);
    } else {
        res.json({});
    }
});

app.post("/auth/verify-token", (req, res) => {
    // Mock decode the JWT (Google ID token)
    const { id_token } = req.body;
    if (!id_token) return res.status(400).json({ error: "No token provided" });
    try {
        // Mock decode: split JWT and parse payload
        const payload = JSON.parse(
            Buffer.from(id_token.split(".")[1], "base64").toString()
        );
        const email = payload.email || "unknown@example.com";
        // Assign mock role
        let role = "Guest";
        if (email.endsWith("@example.com")) role = "Admin";
        // Placeholder for Azure AD integration
        // if (payload.iss === 'https://sts.windows.net/...') { /* assign Azure role */ }
        req.session.user = { email, role };
        return res.json({ email, role });
    } catch (e) {
        return res.status(400).json({ error: "Invalid token format" });
    }
});

app.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
    "/auth/google/callback",
    passport.authenticate("google", {
        failureRedirect: "http://localhost:5173",
    }),
    (req, res) => {
        // Log for debugging
        console.log(
            "Google callback received:",
            req.user ? "User authenticated" : "No user"
        );

        // Save user profile in session for frontend
        if (req.user) {
            req.session.user = {
                email:
                    req.user.emails &&
                    req.user.emails[0] &&
                    req.user.emails[0].value,
                name: req.user.displayName,
                picture:
                    req.user.photos &&
                    req.user.photos[0] &&
                    req.user.photos[0].value,
                role: "GoogleUser",
            };
            console.log("Session user set:", req.session.user);

            // Ensure session is saved before redirect
            req.session.save((err) => {
                if (err) {
                    console.error("Session save error:", err);
                }
                res.redirect("http://localhost:5173");
            });
        } else {
            console.log("No user in callback, redirecting to frontend");
            res.redirect("http://localhost:5173");
        }
    }
);
app.listen(process.env.PORT, () =>
    console.log(`Server running on http://localhost:${process.env.PORT}`)
);
