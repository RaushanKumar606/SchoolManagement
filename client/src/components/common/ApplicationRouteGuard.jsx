
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import "./ApplicationRouteGuard.css";

import {
  getPublicApplicationSettings,
} from "../../services/applicationSettingsService";

function ApplicationRouteGuard({ applicationType, children }) {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchSettings = async () => {
      try {
        const response = await getPublicApplicationSettings();

        if (isMounted) {
          setSettings(response);
        }
      } catch (err) {
        console.error("Application settings error:", err);

        if (isMounted) {
          setError(true);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchSettings();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return <div className="application-route-loading">Checking application availability...</div>;
  }

  if (error || !settings) {
    return (
      <div className="application-route-message">
        <h2>Unable to check application availability</h2>
        <p>Please try again later.</p>
      </div>
    );
  }

  const isOpen = settings[applicationType] === true;

  if (!isOpen) {
    return (
      <div className="application-route-message">
        <div className="application-route-icon">📋</div>
        <h2>Applications Coming Soon</h2>
        <p>
          This application process is currently unavailable.
          Please contact the school office for more information.
        </p>
        <a href="/">Back to Home</a>
      </div>
    );
  }

  return children;
}

export default ApplicationRouteGuard;
