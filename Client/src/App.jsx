import { useEffect, useState, useRef } from 'react';
import { jwtDecode } from 'jwt-decode';
import './App.css';

const BACKEND_URL = 'http://localhost:5001';

function App() {
  const [user, setUser] = useState(null);
  const [oneTapFailed, setOneTapFailed] = useState(false);
  const oneTapInitialized = useRef(false);

  // On mount, check if user is already authenticated
  useEffect(() => {
    console.log("Checking authentication status...");
    fetch(`${BACKEND_URL}/auth/user`, {
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log("Auth status:", data);
        if (data && data.email) {
          console.log("User authenticated:", data.email);
          setUser(data);
        } else {
          console.log("User not authenticated");
        }
      })
      .catch(err => {
        console.error("Error checking auth status:", err);
      });
  }, []);

  // Google One Tap silent login
  useEffect(() => {
    if (user || oneTapInitialized.current) return;
    if (!window.google || !window.google.accounts || !window.google.accounts.id) return;
    oneTapInitialized.current = true;
    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: async (response) => {
        if (response.credential) {
          try {
            await fetch(`${BACKEND_URL}/auth/verify-token`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({ id_token: response.credential })
            })
              .then(res => res.json())
              .then(data => {
                if (data.email) setUser(data);
                else setOneTapFailed(true);
              });
          } catch {
            setOneTapFailed(true);
          }
        } else {
          setOneTapFailed(true);
        }
      },
      auto_select: true,
      cancel_on_tap_outside: false
    });
    window.google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        setOneTapFailed(true);
      }
    });
  }, [user]);

  // Manual sign-in fallback
  const handleManualSignIn = () => {
    window.location.href = `${BACKEND_URL}/auth/google`;
  };

  return (
    <div className="omni-root">
      <header className="omni-header">
        <div className="omni-logo">OmniDoctor</div>
        <div className="omni-actions">
          {user ? (
            <div className="omni-user-info">
              {user.picture && (
                <img
                  src={user.picture}
                  alt="Google profile"
                  className="omni-avatar"
                  style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', marginRight: 10, verticalAlign: 'middle', boxShadow: '0 1px 4px rgba(30,144,255,0.12)' }}
                />
              )}
              Welcome, {user.email} — Role: {user.role}
            </div>
          ) : (
            <button className="omni-signin-btn" onClick={handleManualSignIn}>
              Sign In
            </button>
          )}
        </div>
      </header>
      <main className="omni-main" style={{ textAlign: 'center' }}>
        <h1>
          {user && user.name
            ? `Welcome ${user.name} to OmniDoctor`
            : 'Welcome to OmniDoctor'}
        </h1>
      </main>
      <footer className="omni-footer">
        &copy; {new Date().getFullYear()} OmniDoctor. All rights reserved.
      </footer>
    </div>
  );
}

export default App;
