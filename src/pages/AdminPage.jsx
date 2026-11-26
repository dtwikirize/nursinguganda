import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  BarChart3,
  Calendar,
  Clock,
  CreditCard,
  Eye,
  Lock,
  Mail,
  RefreshCw,
  Search,
  Send,
  ShieldAlert,
  Users
} from "lucide-react";
import { useApp } from "../context/AppContext";

const TABS = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "emails", label: "Emails & Digest", icon: Mail },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "users", label: "Learners", icon: Users },
  { id: "security", label: "Security", icon: ShieldAlert }
];

const DEFAULT_ROW_CAP = 15;

export default function AdminPage() {
  const { user } = useApp();
  const [tab, setTab] = useState("overview");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [tableFilter, setTableFilter] = useState("");
  const [showAllRows, setShowAllRows] = useState(false);

  const [overview, setOverview] = useState(null);
  const [emailsData, setEmailsData] = useState(null);
  const [paymentsData, setPaymentsData] = useState(null);
  const [usersData, setUsersData] = useState(null);
  const [securityData, setSecurityData] = useState(null);

  const [subject, setSubject] = useState("Nursing Uganda Weekly Digest: UNMEB High-Yield Agenda");
  const [topicTitle, setTopicTitle] = useState("This Week's Clinical & Exam Revision Focus");
  const [summary, setSummary] = useState(
    "Stay ahead of your UNMEB exams with this week's curated clinical study units, Uganda MoH 2023 dosage tables, and free referenced eBooks."
  );
  const [highlightsText, setHighlightsText] = useState(
    "Anatomy & Physiology High-Yield Review\nEmergency Obstetric & Neonatal Care Checklists\nFree Referenced Study eBooks (Offline PDF)"
  );
  const [ctaUrl, setCtaUrl] = useState("https://nursinguganda.com/courses");
  const [previewTpl, setPreviewTpl] = useState("monthly");
  const [previewMonth, setPreviewMonth] = useState(() => new Date().getUTCMonth() + 1);
  const [previewData, setPreviewData] = useState({ subject: "", html: "" });
  const [previewLoading, setPreviewLoading] = useState(false);

  const loadEmailPreview = async (tpl = previewTpl, month = previewMonth) => {
    setPreviewLoading(true);
    try {
      const qs = new URLSearchParams({ section: "preview-email", template: tpl, month: String(month) });
      const res = await fetch(`/api/admin?${qs.toString()}`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setPreviewData({ subject: data.subject || "", html: data.html || "" });
      }
    } catch {
      // non-fatal
    }
    setPreviewLoading(false);
  };

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
      if (sec === "emails") {
        setEmailsData(data);
        loadEmailPreview(previewTpl, previewMonth);
      }
      if (sec === "payments") setPaymentsData(data);
      if (sec === "users") setUsersData(data);
      if (sec === "security") setSecurityData(data);
    } catch {
      setError("Network error while loading admin panel.");
    }
    setLoading(false);
  };

  useEffect(() => {
    setTableFilter("");
    setShowAllRows(false);
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

  const handleSendRetention = async () => {
    setNotice("");
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin?section=send-retention", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: "{}"
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Retention check failed.");
      setNotice(
        `10/20/30+ Day Lifecycle Check finished: ${data.sent} sent (${data.courseStallSent || 0} course stalls, ${data.siteInactiveSent || 0} inactive visits), ${data.skipped} skipped.`
      );
      await loadSection("emails");
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleSendMonthly = async () => {
    setNotice("");
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin?section=send-monthly", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: "{}"
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Monthly newsletter batch failed.");
      setNotice(
        `Monthly Dispatch (${data.yearMonth}): ${data.sent} sent, ${data.skipped} skipped. Remaining today: ${data.remainingMonthlyQuota}/25.`
      );
      await loadSection("emails");
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const filteredSubs = useMemo(() => {
    const list = emailsData?.subscribers || [];
    const q = tableFilter.trim().toLowerCase();
    return q ? list.filter((s) => `${s.email} ${s.name} ${s.source}`.toLowerCase().includes(q)) : list;
  }, [emailsData, tableFilter]);

  const filteredOrders = useMemo(() => {
    const list = paymentsData?.orders || [];
    const q = tableFilter.trim().toLowerCase();
    return q ? list.filter((o) => `${o.paypalOrderId} ${o.userEmail} ${o.payerEmail} ${o.status}`.toLowerCase().includes(q)) : list;
  }, [paymentsData, tableFilter]);

  const filteredUsers = useMemo(() => {
    const list = usersData?.users || [];
    const q = tableFilter.trim().toLowerCase();
    return q ? list.filter((u) => `${u.name} ${u.email} ${u.authProvider}`.toLowerCase().includes(q)) : list;
  }, [usersData, tableFilter]);

  const filteredEvents = useMemo(() => {
    const list = securityData?.events || [];
    const q = tableFilter.trim().toLowerCase();
    return q ? list.filter((ev) => `${ev.eventType} ${ev.email} ${ev.ipAddress} ${ev.details}`.toLowerCase().includes(q)) : list;
  }, [securityData, tableFilter]);

  if (!user || !user.isAdmin) {
    return (
      <main className="nu-section">
        <div className="nu-container" style={{ maxWidth: 500 }}>
          <div style={{ border: "1px solid var(--nu-border)", padding: 28, background: "#fff", textAlign: "center", borderRadius: 10 }}>
            <Lock size={34} color="#A137F2" style={{ marginBottom: 10 }} />
            <h1 style={{ fontFamily: "var(--nu-font-serif)", fontSize: "1.45rem", margin: "0 0 8px" }}>
              Owner-Only Admin Panel
            </h1>
            <p style={{ color: "var(--nu-ink-muted)", fontSize: "0.9rem", margin: "0 0 18px" }}>
              {user
                ? `Signed in as ${user.email}. This panel is strictly locked to the site owner's verified email.`
                : "Sign in with the site owner's verified Google or email account to access analytics, emails, and payments."}
            </p>
            <Link to="/login?redirect=/nodadmin" className="nu-btn nu-btn-primary">
              Sign in as Owner
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const maxDailyVisits = Math.max(1, ...(overview?.dailyTrend || []).map((d) => Number(d.visits || 0)));
  const sliceRows = (arr) => (showAllRows || tableFilter ? arr : arr.slice(0, DEFAULT_ROW_CAP));

  return (
    <main style={{ background: "#F8FAFC", minHeight: "82vh" }}>
      {/* Compact Command Header */}
      <section className="nu-cl-hero" style={{ padding: "18px 0" }}>
        <div className="nu-container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <div>
            <span className="nu-badge nu-badge-highyield" style={{ marginBottom: 4, fontSize: "0.72rem" }}>
              Owner Console &middot; {user.email}
            </span>
            <h1 style={{ fontFamily: "var(--nu-font-serif)", fontSize: "clamp(1.25rem, 2.2vw, 1.6rem)", margin: 0 }}>
              Nursing Uganda Admin &amp; Analytics
            </h1>
          </div>
          <button
            type="button"
            onClick={() => loadSection(tab)}
            className="nu-btn nu-btn-secondary"
            style={{ height: 36, fontSize: "0.84rem" }}
            disabled={loading}
          >
            <RefreshCw size={14} /> {loading ? "Refreshing..." : "Refresh Data"}
          </button>
        </div>
      </section>

      {/* Compact Sticky Horizontal Navigation Bar (Fits Laptop, Tablet & Phone cleanly) */}
      <div className="nu-admin-nav-strip">
        <div className="nu-container">
          <div className="nu-admin-nav-pills" role="tablist" aria-label="Admin Console Sections">
            {TABS.map((t) => {
              const Icon = t.icon;
              const isActive = tab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`nu-admin-pill ${isActive ? "active" : ""}`}
                  onClick={() => setTab(t.id)}
                >
                  <Icon size={15} />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Container (Full Width without wasted left column) */}
      <section className="nu-container" style={{ paddingTop: 20, paddingBottom: 40 }}>
        {error && (
          <div style={{ padding: "10px 14px", background: "var(--nu-danger-bg)", color: "var(--nu-danger)", marginBottom: 14, borderRadius: 6, fontSize: "0.88rem" }}>
            {error}
          </div>
        )}
        {notice && (
          <div style={{ padding: "10px 14px", background: "var(--nu-teal-bg)", color: "var(--nu-teal-ink)", marginBottom: 14, borderRadius: 6, fontSize: "0.88rem" }}>
            {notice}
          </div>
        )}

        {tab === "overview" && overview && (
          <div style={{ display: "grid", gap: 16 }}>
            <div className="nu-admin-kpi-grid nu-admin-kpi-grid--compact">
              <div className="nu-admin-kpi">
                <small>Site Visits</small>
                <strong>{Number(overview.visitStats?.totalVisits || 0).toLocaleString()}</strong>
                <span>{Number(overview.visitStats?.visitsToday || 0)} today &middot; {Number(overview.visitStats?.uniqueToday || 0)} uniq</span>
              </div>
              <div className="nu-admin-kpi">
                <small>Registered Learners</small>
                <strong>{Number(overview.userStats?.totalUsers || 0).toLocaleString()}</strong>
                <span>{Number(overview.userStats?.verifiedUsers || 0)} verified &middot; {Number(overview.userStats?.googleUsers || 0)} Google</span>
              </div>
              <div className="nu-admin-kpi">
                <small>PayPal Revenue</small>
                <strong>${Number(overview.payStats?.totalRevenueUsd || 0).toFixed(2)}</strong>
                <span>{Number(overview.payStats?.totalOrders || 0)} completed orders</span>
              </div>
              <div className="nu-admin-kpi">
                <small>Daily Email Quota</small>
                <strong>{overview.emailQuota?.digestToday || 0} / 50</strong>
                <span>Digest &middot; {overview.emailQuota?.totalToday || 0}/100 total</span>
              </div>
            </div>

            {/* Side-by-Side 2-Column Overview Grid (Cuts page height nearly in half!) */}
            <div className="nu-admin-split-grid">
              <div className="nu-admin-card">
                <h3 style={{ margin: "0 0 12px", fontSize: "1rem", display: "flex", alignItems: "center", gap: 8 }}>
                  <Activity size={17} color="#A137F2" /> Last 7 Days Traffic
                </h3>
                {(!overview.dailyTrend || overview.dailyTrend.length === 0) ? (
                  <p style={{ color: "var(--nu-ink-muted)", margin: 0, fontSize: "0.88rem" }}>Visit data will appear as learners browse pages.</p>
                ) : (
                  <div style={{ display: "grid", gap: 8 }}>
                    {overview.dailyTrend.map((d) => (
                      <div key={d.day} className="nu-admin-trend-row">
                        <span style={{ color: "#475569", fontWeight: 600 }}>{d.day}</span>
                        <div style={{ background: "var(--nu-border-light)", height: 9, borderRadius: 99, overflow: "hidden" }}>
                          <div style={{ width: `${Math.round((Number(d.visits) / maxDailyVisits) * 100)}%`, background: "#A137F2", height: "100%" }} />
                        </div>
                        <span style={{ textAlign: "right", color: "var(--nu-ink-muted)", fontWeight: 600 }}>
                          {d.visits} <small>({d.visitors})</small>
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="nu-admin-card">
                <h3 style={{ margin: "0 0 12px", fontSize: "1rem" }}>Top Visited Pages (30d)</h3>
                <div className="nu-admin-table-wrap" style={{ maxHeight: 280, overflowY: "auto" }}>
                  <table className="nu-admin-table">
                    <thead>
                      <tr><th>Page Path</th><th>Visits</th><th>Uniq</th></tr>
                    </thead>
                    <tbody>
                      {(overview.topPages || []).map((p) => (
                        <tr key={p.path}>
                          <td><code>{p.path}</code></td>
                          <td><strong>{p.visits}</strong></td>
                          <td>{p.uniqueVisitors}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "emails" && (
          <div style={{ display: "grid", gap: 18 }}>
            <div className="nu-admin-card" style={{ borderLeft: "4px solid #7C3AED" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: "1.02rem" }}>Automated Email Engine (Hostinger 100/Day Safe Cap: 90/Day)</h3>
                  <small style={{ color: "var(--nu-ink-muted)" }}>
                    Today: {emailsData?.emailQuota?.totalToday || 0}/{emailsData?.emailQuota?.totalLimit || 90} total &middot; Digest{" "}
                    {emailsData?.emailQuota?.digestToday || 0}/{emailsData?.emailQuota?.digestLimit || 50} &middot; 10/20/30d Retention{" "}
                    {emailsData?.emailQuota?.retentionToday || 0}/{emailsData?.emailQuota?.retentionLimit || 15} &middot; Monthly{" "}
                    {emailsData?.emailQuota?.monthlyToday || 0}/{emailsData?.emailQuota?.monthlyLimit || 25}
                  </small>
                </div>
                <div className="nu-admin-actions-row" style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  <button type="button" onClick={handleSendRetention} disabled={loading} className="nu-btn nu-btn-dark" style={{ height: 34, fontSize: "0.8rem", padding: "0 12px" }}>
                    <Clock size={14} /> Run 10/20/30d Nudges
                  </button>
                  <button type="button" onClick={handleSendMonthly} disabled={loading} className="nu-btn nu-btn-secondary" style={{ height: 34, fontSize: "0.8rem", padding: "0 12px" }}>
                    <Calendar size={14} /> Send Monthly Dispatch
                  </button>
                  <button type="button" onClick={handleSendBatch} disabled={loading} className="nu-btn nu-btn-primary" style={{ height: 34, fontSize: "0.8rem", padding: "0 12px" }}>
                    <Send size={14} /> Send Weekly Digest
                  </button>
                </div>
              </div>
            </div>

            <div className="nu-admin-split-grid">
              <div className="nu-admin-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: "1rem", display: "flex", alignItems: "center", gap: 6 }}>
                      <Eye size={16} /> Live Email Template Preview
                    </h3>
                    <small style={{ color: "var(--nu-ink-muted)" }}>
                      {previewData.subject || "Select a template to inspect responsive layout"}
                    </small>
                  </div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    <select
                      value={previewTpl}
                      onChange={(e) => {
                        const next = e.target.value;
                        setPreviewTpl(next);
                        loadEmailPreview(next, previewMonth);
                      }}
                      style={{ height: 32, padding: "0 8px", border: "1px solid var(--nu-border)", borderRadius: 4, fontSize: "0.8rem" }}
                    >
                      <option value="monthly">Monthly Dispatch (12-Mo)</option>
                      <option value="course-stall-10">Course Stall | 10 Days</option>
                      <option value="course-stall-20">Course Stall | 20 Days</option>
                      <option value="course-stall-30">Course Stall | 30+ Days</option>
                      <option value="site-inactive-10">Site Away | 10 Days</option>
                      <option value="site-inactive-20">Site Away | 20 Days (50% Off)</option>
                      <option value="site-inactive-30">Site Away | 30+ Days</option>
                      <option value="digest">Weekly Study Digest</option>
                      <option value="welcome">Welcome Verification</option>
                      <option value="certificate">Certificate Earned</option>
                      <option value="quiz">Quiz Result Breakdown</option>
                    </select>
                    {previewTpl === "monthly" && (
                      <select
                        value={previewMonth}
                        onChange={(e) => {
                          const m = Number(e.target.value);
                          setPreviewMonth(m);
                          loadEmailPreview("monthly", m);
                        }}
                        style={{ height: 32, padding: "0 8px", border: "1px solid var(--nu-border)", borderRadius: 4, fontSize: "0.8rem" }}
                      >
                        {Array.from({ length: 12 }, (_, idx) => (
                          <option key={idx + 1} value={idx + 1}>Month {idx + 1}</option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
                {previewLoading ? (
                  <p style={{ color: "var(--nu-ink-muted)", fontSize: "0.85rem" }}>Rendering preview...</p>
                ) : (
                  <iframe
                    title="Email Template Preview"
                    className="nu-admin-iframe-preview"
                    srcDoc={previewData.html || "<p style='font-family:sans-serif;padding:16px;'>Select a template above.</p>"}
                    sandbox="allow-same-origin"
                    style={{ width: "100%", height: 500, border: "1px solid var(--nu-border)", borderRadius: 6, background: "#F1F5F9" }}
                  />
                )}
              </div>

              <div className="nu-admin-card">
                <h3 style={{ margin: "0 0 10px", fontSize: "1rem" }}>Weekly Digest Topic Override</h3>
                <form onSubmit={handleSaveCampaign} style={{ display: "grid", gap: 8 }}>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Email subject"
                    required
                    style={{ height: 36, padding: "0 10px", border: "1px solid var(--nu-border)", borderRadius: 4, fontSize: "0.86rem" }}
                  />
                  <input
                    type="text"
                    value={topicTitle}
                    onChange={(e) => setTopicTitle(e.target.value)}
                    placeholder="Topic heading"
                    required
                    style={{ height: 36, padding: "0 10px", border: "1px solid var(--nu-border)", borderRadius: 4, fontSize: "0.86rem" }}
                  />
                  <textarea
                    rows={2}
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    placeholder="Weekly topic summary"
                    required
                    style={{ padding: 8, border: "1px solid var(--nu-border)", borderRadius: 4, fontSize: "0.85rem", fontFamily: "inherit" }}
                  />
                  <textarea
                    rows={2}
                    value={highlightsText}
                    onChange={(e) => setHighlightsText(e.target.value)}
                    placeholder="One agenda highlight per line"
                    style={{ padding: 8, border: "1px solid var(--nu-border)", borderRadius: 4, fontSize: "0.85rem", fontFamily: "inherit" }}
                  />
                  <input
                    type="url"
                    value={ctaUrl}
                    onChange={(e) => setCtaUrl(e.target.value)}
                    placeholder="CTA URL"
                    required
                    style={{ height: 36, padding: "0 10px", border: "1px solid var(--nu-border)", borderRadius: 4, fontSize: "0.86rem" }}
                  />
                  <button type="submit" disabled={loading} className="nu-btn nu-btn-dark" style={{ width: "fit-content", height: 36, fontSize: "0.84rem" }}>
                    Save Active Weekly Topic
                  </button>
                </form>

                <hr style={{ margin: "18px 0", border: "none", borderTop: "1px solid var(--nu-border)" }} />
                <h4 style={{ margin: "0 0 8px", fontSize: "0.92rem" }}>12-Month Automated Newsletter Calendar</h4>
                <div className="nu-admin-table-wrap" style={{ maxHeight: 230, overflowY: "auto" }}>
                  <table className="nu-admin-table">
                    <thead>
                      <tr><th>Month</th><th>Theme</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                      {(emailsData?.monthlySchedule || []).map((m) => (
                        <tr key={m.yearMonth}>
                          <td><code>{m.yearMonth}</code></td>
                          <td>
                            <div style={{ fontWeight: 700, fontSize: "0.82rem" }}>{m.seasonLabel}</div>
                            <small style={{ color: "var(--nu-ink-muted)" }}>{m.subject}</small>
                          </td>
                          <td>
                            <span className={`nu-badge ${m.yearMonth === emailsData?.currentMonthYm ? "nu-badge-free" : "nu-badge-preview"}`}>
                              {m.yearMonth === emailsData?.currentMonthYm ? "Active Month" : "Scheduled"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="nu-admin-split-grid">
              <div className="nu-admin-card">
                <h3 style={{ margin: "0 0 10px", fontSize: "1rem" }}>
                  Recent 10/20/30+ Day Lifecycle Nudges ({(emailsData?.retentionNudges || []).length})
                </h3>
                <div className="nu-admin-table-wrap">
                  <table className="nu-admin-table">
                    <thead>
                      <tr><th>Recipient</th><th>Trigger</th><th>Target</th><th>Sent</th></tr>
                    </thead>
                    <tbody>
                      {(emailsData?.retentionNudges || []).length === 0 ? (
                        <tr><td colSpan={4} style={{ color: "var(--nu-ink-muted)" }}>No lifecycle nudges logged yet | runs daily at 05:00 UTC or via button above.</td></tr>
                      ) : (
                        (emailsData?.retentionNudges || []).map((n) => (
                          <tr key={n.id}>
                            <td>{n.recipient}</td>
                            <td>
                              <span className="nu-badge nu-badge-highyield">
                                {n.nudgeKind === "course_stall" ? "Course" : "Site"} &middot; {n.milestoneDays}d
                              </span>
                            </td>
                            <td><code>{n.targetKey}</code></td>
                            <td>{n.sentAt ? new Date(n.sentAt).toLocaleDateString() : "-"}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="nu-admin-card">
                <AdminTableHeader
                  title={`Subscribers (${filteredSubs.length})`}
                  filter={tableFilter}
                  onFilter={setTableFilter}
                  total={filteredSubs.length}
                  showAll={showAllRows}
                  onToggleShowAll={() => setShowAllRows((v) => !v)}
                />
                <div className="nu-admin-table-wrap">
                  <table className="nu-admin-table">
                    <thead>
                      <tr><th>Email</th><th>Name</th><th>Status</th><th>Monthly</th><th>Digest</th></tr>
                    </thead>
                    <tbody>
                      {sliceRows(filteredSubs).map((s) => (
                        <tr key={s.id}>
                          <td>{s.email}</td>
                          <td>{s.name || "-"}</td>
                          <td>
                            <span className={`nu-badge ${s.subscribed ? "nu-badge-free" : "nu-badge-highyield"}`}>
                              {s.subscribed ? "Active" : "Unsub"}
                            </span>
                          </td>
                          <td><code>{s.lastMonthlySentYm || "-"}</code></td>
                          <td>{s.lastDigestSentAt ? new Date(s.lastDigestSentAt).toLocaleDateString() : "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "payments" && (
          <div className="nu-admin-card">
            <AdminTableHeader
              title={`PayPal Orders (${filteredOrders.length})`}
              filter={tableFilter}
              onFilter={setTableFilter}
              total={filteredOrders.length}
              showAll={showAllRows}
              onToggleShowAll={() => setShowAllRows((v) => !v)}
            />
            <div className="nu-admin-table-wrap">
              <table className="nu-admin-table">
                <thead>
                  <tr><th>Order ID</th><th>Student</th><th>Payer Email</th><th>USD</th><th>Status</th><th>Date</th></tr>
                </thead>
                <tbody>
                  {sliceRows(filteredOrders).map((o) => (
                    <tr key={o.id}>
                      <td><code>{o.paypalOrderId}</code></td>
                      <td>{o.userEmail || o.userName || "-"}</td>
                      <td>{o.payerEmail || "-"}</td>
                      <td><strong>${Number(o.amountUsd).toFixed(2)}</strong></td>
                      <td><span className="nu-badge nu-badge-free">{o.status}</span></td>
                      <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "users" && (
          <div className="nu-admin-card">
            <AdminTableHeader
              title={`Registered Learners (${filteredUsers.length})`}
              filter={tableFilter}
              onFilter={setTableFilter}
              total={filteredUsers.length}
              showAll={showAllRows}
              onToggleShowAll={() => setShowAllRows((v) => !v)}
            />
            <div className="nu-admin-table-wrap">
              <table className="nu-admin-table">
                <thead>
                  <tr><th>Name</th><th>Email</th><th>Verified</th><th>Provider</th><th>Units</th><th>Last IP</th></tr>
                </thead>
                <tbody>
                  {sliceRows(filteredUsers).map((u) => (
                    <tr key={u.id}>
                      <td><strong>{u.name}</strong></td>
                      <td>{u.email}</td>
                      <td>
                        <span className={`nu-badge ${u.emailVerified ? "nu-badge-free" : "nu-badge-highyield"}`}>
                          {u.emailVerified ? "Verified" : "Pending"}
                        </span>
                      </td>
                      <td><code>{u.authProvider}</code></td>
                      <td>{u.enrollmentCount}</td>
                      <td><code>{u.lastLoginIp || "-"}</code></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "security" && (
          <div className="nu-admin-card">
            <AdminTableHeader
              title={`Security Audit Events (${filteredEvents.length})`}
              filter={tableFilter}
              onFilter={setTableFilter}
              total={filteredEvents.length}
              showAll={showAllRows}
              onToggleShowAll={() => setShowAllRows((v) => !v)}
            />
            <div className="nu-admin-table-wrap">
              <table className="nu-admin-table">
                <thead>
                  <tr><th>Event</th><th>Severity</th><th>Email</th><th>IP</th><th>Details</th><th>Time</th></tr>
                </thead>
                <tbody>
                  {sliceRows(filteredEvents).map((ev) => (
                    <tr key={ev.id}>
                      <td><code>{ev.eventType}</code></td>
                      <td>
                        <span className={`nu-badge ${ev.severity === "high" ? "nu-badge-bestseller" : "nu-badge-highyield"}`}>
                          {ev.severity}
                        </span>
                      </td>
                      <td>{ev.email || "-"}</td>
                      <td><code>{ev.ipAddress}</code></td>
                      <td style={{ maxWidth: 260, overflow: "hidden", textOverflow: "ellipsis" }}>{ev.details}</td>
                      <td>{new Date(ev.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

function AdminTableHeader({ title, filter, onFilter, total, showAll, onToggleShowAll }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10, marginBottom: 12 }}>
      <h3 style={{ margin: 0, fontSize: "1rem" }}>{title}</h3>
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", flex: "1 1 200px", justifyContent: "flex-end" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, border: "1px solid var(--nu-border)", borderRadius: 6, padding: "0 10px", height: 34, background: "#fff", flex: "1 1 150px", maxWidth: 240 }}>
          <Search size={13} color="#64748b" />
          <input
            type="search"
            value={filter}
            onChange={(e) => onFilter(e.target.value)}
            placeholder="Filter rows..."
            style={{ border: 0, outline: "none", width: "100%", minWidth: 0, fontSize: "0.82rem" }}
          />
        </div>
        {total > DEFAULT_ROW_CAP && !filter && (
          <button
            type="button"
            className="nu-btn nu-btn-outline"
            style={{ height: 32, padding: "0 10px", fontSize: "0.78rem" }}
            onClick={onToggleShowAll}
          >
            {showAll ? `Show Top ${DEFAULT_ROW_CAP}` : `Show All (${total})`}
          </button>
        )}
      </div>
    </div>
  );
}
