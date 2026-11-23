import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  BarChart3,
  CreditCard,
  Lock,
  Mail,
  RefreshCw,
  Send,
  ShieldAlert,
  Users
} from "lucide-react";
import { useApp } from "../context/AppContext";

const TABS = [
  { id: "overview", label: "Overview & Analytics", icon: BarChart3 },
  { id: "emails", label: "Emails & Weekly Digest", icon: Mail },
  { id: "payments", label: "PayPal Payments", icon: CreditCard },
  { id: "users", label: "Learners", icon: Users },
  { id: "security", label: "Security Alerts", icon: ShieldAlert }
];

export default function AdminPage() {
  const { user } = useApp();
  const [tab, setTab] = useState("overview");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [overview, setOverview] = useState(null);
  const [emailsData, setEmailsData] = useState(null);
  const [paymentsData, setPaymentsData] = useState(null);
  const [usersData, setUsersData] = useState(null);
  const [securityData, setSecurityData] = useState(null);

  // Weekly Digest Campaign form
  const [subject, setSubject] = useState("Nursing Uganda Weekly Digest: UNMEB High-Yield Agenda");
  const [topicTitle, setTopicTitle] = useState("This Week's Clinical & Exam Revision Focus");
  const [summary, setSummary] = useState(
    "Stay ahead of your UNMEB exams with this week's curated clinical study units, Uganda MoH 2023 dosage tables, and free referenced eBooks."
  );
  const [highlightsText, setHighlightsText] = useState(
    "Anatomy & Physiology High-Yield Review\nEmergency Obstetric & Neonatal Care Checklists\nFree Referenced Study eBooks (Offline PDF)"
  );
  const [ctaUrl, setCtaUrl] = useState("https://nursinguganda.com/courses");

  const loadSection = async (sec) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin?section=${encodeURIComponent(sec)}`, { credentials: "include" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to load admin data.");
        setLoading(false);
        return;
      }
      if (sec === "overview") setOverview(data);
      if (sec === "emails") setEmailsData(data);
      if (sec === "payments") setPaymentsData(data);
      if (sec === "users") setUsersData(data);
      if (sec === "security") setSecurityData(data);
    } catch {
      setError("Network error while loading admin panel.");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user?.isAdmin) {
      loadSection(tab);
    }
  }, [user, tab]);

  const handleSaveCampaign = async (e) => {
    e.preventDefault();
    setNotice("");
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin?section=campaign", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          topicTitle,
          summary,
          highlights: highlightsText.split("\n").map((s) => s.trim()).filter(Boolean),
          ctaUrl
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not save campaign.");
      setNotice("Weekly Digest campaign saved and activated.");
      await loadSection("emails");
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleSendBatch = async () => {
    setNotice("");
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin?section=send-digest", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: "{}"
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Batch send failed.");
      setNotice(
        `Digest batch finished: ${data.sent} sent, ${data.skipped} skipped. Remaining digest quota today: ${data.remainingDigestQuota}/50.`
      );
      await loadSection("emails");
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  if (!user || !user.isAdmin) {
    return (
      <main className="nu-section">
        <div className="nu-container" style={{ maxWidth: 520 }}>
          <div style={{ border: "1px solid var(--nu-border)", padding: 32, background: "#fff", textAlign: "center", borderRadius: 6 }}>
            <Lock size={36} color="#A137F2" style={{ marginBottom: 12 }} />
            <h1 style={{ fontFamily: "var(--nu-font-serif)", fontSize: "1.5rem", margin: "0 0 8px" }}>
              Owner-Only Admin Panel
            </h1>
            <p style={{ color: "var(--nu-ink-muted)", fontSize: "0.92rem", margin: "0 0 20px" }}>
              {user
                ? `Signed in as ${user.email}. This panel is strictly locked to the site owner's verified email.`
                : "Sign in with the site owner's verified Google or email account to access analytics, emails, and payments."}
            </p>
            <Link to="/login?redirect=/admin" className="nu-btn nu-btn-primary">
              Sign in as Owner
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const maxDailyVisits = Math.max(1, ...(overview?.dailyTrend || []).map((d) => Number(d.visits || 0)));

  return (
    <main style={{ background: "var(--nu-bg-subtle)", minHeight: "82vh" }}>
      <section className="nu-cl-hero" style={{ padding: "24px 0" }}>
        <div className="nu-container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <span className="nu-badge nu-badge-highyield" style={{ marginBottom: 6 }}>
              Owner Console · {user.email}
            </span>
            <h1 style={{ fontFamily: "var(--nu-font-serif)", fontSize: "1.75rem", margin: 0 }}>
              Nursing Uganda Admin &amp; Analytics
            </h1>
          </div>
          <button type="button" onClick={() => loadSection(tab)} className="nu-btn nu-btn-secondary" disabled={loading}>
            <RefreshCw size={15} /> {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </section>

      <div className="nu-container nu-dash-layout">
        <aside className="nu-dash-sidebar">
          <div className="nu-dash-sidebar-head">
            <strong>Admin Controls</strong>
            <small>Strict Owner Access</small>
          </div>
          <nav className="nu-dash-nav">
            {TABS.map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  type="button"
                  className={`nu-dash-nav-btn ${tab === t.id ? "active" : ""}`}
                  onClick={() => setTab(t.id)}
                >
                  <Icon size={17} />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        <section className="nu-dash-main">
          {error && (
            <div style={{ padding: 12, background: "var(--nu-danger-bg)", color: "var(--nu-danger)", marginBottom: 16, borderRadius: 4 }}>
              {error}
            </div>
          )}
          {notice && (
            <div style={{ padding: 12, background: "var(--nu-teal-bg)", color: "var(--nu-teal-ink)", marginBottom: 16, borderRadius: 4 }}>
              {notice}
            </div>
          )}

          {tab === "overview" && overview && (
            <div style={{ display: "grid", gap: 20 }}>
              <div className="nu-admin-kpi-grid">
                <div className="nu-admin-kpi">
                  <small>Page Visits (All Time / Today)</small>
                  <strong>{Number(overview.visitStats?.totalVisits || 0).toLocaleString()}</strong>
                  <span>{Number(overview.visitStats?.visitsToday || 0)} visits · {Number(overview.visitStats?.uniqueToday || 0)} unique today</span>
                </div>
                <div className="nu-admin-kpi">
                  <small>Registered Learners</small>
                  <strong>{Number(overview.userStats?.totalUsers || 0).toLocaleString()}</strong>
                  <span>{Number(overview.userStats?.verifiedUsers || 0)} verified · {Number(overview.userStats?.googleUsers || 0)} Google</span>
                </div>
                <div className="nu-admin-kpi">
                  <small>PayPal Revenue (Completed)</small>
                  <strong>${Number(overview.payStats?.totalRevenueUsd || 0).toFixed(2)}</strong>
                  <span>{Number(overview.payStats?.totalOrders || 0)} paid orders</span>
                </div>
                <div className="nu-admin-kpi">
                  <small>Hostinger Daily Email Quota</small>
                  <strong>{overview.emailQuota?.digestToday || 0} / 50</strong>
                  <span>Digest today · {overview.emailQuota?.totalToday || 0}/100 Hostinger total</span>
                </div>
              </div>

              <div className="nu-admin-card">
                <h3 style={{ margin: "0 0 14px", display: "flex", alignItems: "center", gap: 8 }}>
                  <Activity size={18} color="#A137F2" /> Last 7 Days Traffic
                </h3>
                {(!overview.dailyTrend || overview.dailyTrend.length === 0) ? (
                  <p style={{ color: "var(--nu-ink-muted)", margin: 0 }}>Visit data will appear as learners browse pages.</p>
                ) : (
                  <div style={{ display: "grid", gap: 10 }}>
                    {overview.dailyTrend.map((d) => (
                      <div key={d.day} style={{ display: "grid", gridTemplateColumns: "95px 1fr 110px", alignItems: "center", gap: 12, fontSize: "0.85rem" }}>
                        <span>{d.day}</span>
                        <div style={{ background: "var(--nu-border-light)", height: 10, borderRadius: 99, overflow: "hidden" }}>
                          <div style={{ width: `${Math.round((Number(d.visits) / maxDailyVisits) * 100)}%`, background: "#A137F2", height: "100%" }} />
                        </div>
                        <span style={{ textAlign: "right", color: "var(--nu-ink-muted)" }}>{d.visits} ({d.visitors} uniq)</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="nu-admin-card">
                <h3 style={{ margin: "0 0 12px" }}>Top Visited Pages (Last 30 Days)</h3>
                <div className="nu-admin-table-wrap">
                  <table className="nu-admin-table">
                    <thead>
                      <tr><th>Page Path</th><th>Visits</th><th>Unique Visitors</th></tr>
                    </thead>
                    <tbody>
                      {(overview.topPages || []).map((p) => (
                        <tr key={p.path}>
                          <td><code>{p.path}</code></td>
                          <td>{p.visits}</td>
                          <td>{p.uniqueVisitors}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {tab === "emails" && (
            <div style={{ display: "grid", gap: 20 }}>
              <div className="nu-admin-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 14 }}>
                  <div>
                    <h3 style={{ margin: 0 }}>Weekly Digest Scheduler (50/Day Safe Cap)</h3>
                    <small style={{ color: "var(--nu-ink-muted)" }}>
                      Sent today: {emailsData?.emailQuota?.digestToday || 0} / 50 digest · {emailsData?.emailQuota?.totalToday || 0} / 100 Hostinger total limit
                    </small>
                  </div>
                  <button type="button" onClick={handleSendBatch} disabled={loading} className="nu-btn nu-btn-primary">
                    <Send size={15} /> Send Today&apos;s Batch (Up to 50)
                  </button>
                </div>

                <form onSubmit={handleSaveCampaign} style={{ display: "grid", gap: 10 }}>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Email subject"
                    required
                    style={{ height: 40, padding: "0 12px", border: "1px solid var(--nu-border)" }}
                  />
                  <input
                    type="text"
                    value={topicTitle}
                    onChange={(e) => setTopicTitle(e.target.value)}
                    placeholder="Topic / Agenda heading"
                    required
                    style={{ height: 40, padding: "0 12px", border: "1px solid var(--nu-border)" }}
                  />
                  <textarea
                    rows={3}
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    placeholder="Weekly topic summary"
                    required
                    style={{ padding: 10, border: "1px solid var(--nu-border)" }}
                  />
                  <textarea
                    rows={3}
                    value={highlightsText}
                    onChange={(e) => setHighlightsText(e.target.value)}
                    placeholder="One agenda highlight per line"
                    style={{ padding: 10, border: "1px solid var(--nu-border)" }}
                  />
                  <input
                    type="url"
                    value={ctaUrl}
                    onChange={(e) => setCtaUrl(e.target.value)}
                    placeholder="CTA URL (e.g. https://nursinguganda.com/courses)"
                    required
                    style={{ height: 40, padding: "0 12px", border: "1px solid var(--nu-border)" }}
                  />
                  <button type="submit" disabled={loading} className="nu-btn nu-btn-dark" style={{ width: "fit-content" }}>
                    Save Active Weekly Topic
                  </button>
                </form>
              </div>

              <div className="nu-admin-card">
                <h3 style={{ margin: "0 0 12px" }}>Collected Email Subscribers ({emailsData?.subscribers?.length || 0})</h3>
                <div className="nu-admin-table-wrap">
                  <table className="nu-admin-table">
                    <thead>
                      <tr><th>Email</th><th>Name</th><th>Source</th><th>Status</th><th>Last Digest</th></tr>
                    </thead>
                    <tbody>
                      {(emailsData?.subscribers || []).map((s) => (
                        <tr key={s.id}>
                          <td>{s.email}</td>
                          <td>{s.name || "—"}</td>
                          <td>{s.source}</td>
                          <td>{s.subscribed ? "Subscribed" : "Unsubscribed"}</td>
                          <td>{s.lastDigestSentAt ? new Date(s.lastDigestSentAt).toLocaleDateString() : "Pending"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {tab === "payments" && (
            <div className="nu-admin-card">
              <h3 style={{ margin: "0 0 12px" }}>PayPal Orders ({paymentsData?.orders?.length || 0})</h3>
              <div className="nu-admin-table-wrap">
                <table className="nu-admin-table">
                  <thead>
                    <tr><th>PayPal Order ID</th><th>Student</th><th>Payer Email</th><th>Amount</th><th>Status</th><th>Date</th></tr>
                  </thead>
                  <tbody>
                    {(paymentsData?.orders || []).map((o) => (
                      <tr key={o.id}>
                        <td><code>{o.paypalOrderId}</code></td>
                        <td>{o.userEmail || o.userName || "—"}</td>
                        <td>{o.payerEmail || "—"}</td>
                        <td><strong>${Number(o.amountUsd).toFixed(2)}</strong></td>
                        <td>{o.status}</td>
                        <td>{new Date(o.createdAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === "users" && (
            <div className="nu-admin-card">
              <h3 style={{ margin: "0 0 12px" }}>Registered Learners ({usersData?.users?.length || 0})</h3>
              <div className="nu-admin-table-wrap">
                <table className="nu-admin-table">
                  <thead>
                    <tr><th>Name</th><th>Email</th><th>Verified</th><th>Auth</th><th>Courses</th><th>Last IP</th></tr>
                  </thead>
                  <tbody>
                    {(usersData?.users || []).map((u) => (
                      <tr key={u.id}>
                        <td>{u.name}</td>
                        <td>{u.email}</td>
                        <td>{u.emailVerified ? "Verified" : "Pending"}</td>
                        <td>{u.authProvider}</td>
                        <td>{u.enrollmentCount}</td>
                        <td><code>{u.lastLoginIp || "—"}</code></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === "security" && (
            <div className="nu-admin-card">
              <h3 style={{ margin: "0 0 12px" }}>Security Audit Events ({securityData?.events?.length || 0})</h3>
              <div className="nu-admin-table-wrap">
                <table className="nu-admin-table">
                  <thead>
                    <tr><th>Event</th><th>Severity</th><th>Email</th><th>IP</th><th>Details</th><th>Time</th></tr>
                  </thead>
                  <tbody>
                    {(securityData?.events || []).map((ev) => (
                      <tr key={ev.id}>
                        <td><code>{ev.eventType}</code></td>
                        <td>{ev.severity}</td>
                        <td>{ev.email || "—"}</td>
                        <td><code>{ev.ipAddress}</code></td>
                        <td>{ev.details}</td>
                        <td>{new Date(ev.createdAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
