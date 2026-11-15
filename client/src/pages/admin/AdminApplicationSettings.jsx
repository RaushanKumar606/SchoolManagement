
import { useEffect, useState } from "react";

import {
  getAdminApplicationSettings,
  updateApplicationSettings,
} from "../../services/applicationSettingsService";

import "./AdminApplicationSettings.css";

function AdminApplicationSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch settings from backend
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getAdminApplicationSettings();
        setSettings(response);
      } catch (err) {
        setError(
          err.message || "Failed to load application settings."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Toggle application settings
  const handleToggle = async (field) => {
    if (!settings || saving) return;

    const previousSettings = settings;
    const updatedValue = !settings[field];

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      // Optimistic UI update
      setSettings({
        ...settings,
        [field]: updatedValue,
      });

      const response = await updateApplicationSettings({
        [field]: updatedValue,
      });

      setSettings(response.settings || {
        ...previousSettings,
        [field]: updatedValue,
      });

      setSuccess("Application settings updated successfully.");
    } catch (err) {
      // Restore old settings if API fails
      setSettings(previousSettings);

      setError(
        err.message || "Unable to update application settings."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="application-settings-loading">
        Loading application settings...
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="application-settings-error">
        {error || "Application settings not found."}
      </div>
    );
  }

  const applicationOptions = [
    {
      key: "student_admission",
      title: "Student Admission",
      description:
        "Control whether new students can submit admission applications.",
    },
    {
      key: "teacher_hiring",
      title: "Teacher Hiring",
      description:
        "Control whether teachers can submit registration applications.",
    },
  ];

  return (
    <div className="application-settings-page">

      <div className="application-settings-header">
        <div>
          <h2>Application Settings</h2>
          <p>
            Manage student admission and teacher hiring availability.
          </p>
        </div>
      </div>

      {error && (
        <div className="application-settings-error">
          {error}
        </div>
      )}

      {success && (
        <div className="application-settings-success">
          {success}
        </div>
      )}

      <div className="application-settings-list">

        {applicationOptions.map((option) => {
          const isEnabled = Boolean(settings[option.key]);

          return (
            <div
              className="application-setting-card"
              key={option.key}
            >

              <div className="application-setting-info">
                <h3>{option.title}</h3>
                <p>{option.description}</p>

                <span
                  className={`application-setting-status ${
                    isEnabled ? "status-open" : "status-closed"
                  }`}
                >
                  {isEnabled ? "Applications Open" : "Coming Soon"}
                </span>
              </div>

              <div className="application-setting-action">
                <span>
                  {isEnabled ? "ON" : "OFF"}
                </span>

                <button
                  type="button"
                  className={`application-toggle ${
                    isEnabled ? "toggle-active" : ""
                  }`}
                  onClick={() => handleToggle(option.key)}
                  disabled={saving}
                  aria-pressed={isEnabled}
                >
                  <span className="application-toggle-circle" />
                </button>
              </div>

            </div>
          );
        })}

      </div>

      {saving && (
        <p className="application-settings-saving">
          Saving changes...
        </p>
      )}

    </div>
  );
}

export default AdminApplicationSettings;



