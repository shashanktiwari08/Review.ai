import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

const OwnerAnalytics = () => {
  const [totalCompanies, setTotalCompanies] = useState(0);
  const [monthlyEarnings, setMonthlyEarnings] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [repeatPurchases, setRepeatPurchases] = useState(0);
  const [recentPayments, setRecentPayments] = useState([]);
  const [companyList, setCompanyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch companies
        const { data: companies, error: compErr } = await supabase
          .from('companies')
          .select('*');
        if (compErr) throw compErr;

        // Fetch payments with company name
        const { data: payments, error: payErr } = await supabase
          .from('payments')
          .select('*, companies(name)')
          .order('created_at', { ascending: false });
        if (payErr) throw payErr;

        // Compute stats
        const companySet = new Set();
        const companyCountMap = {};
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        let earningsThisMonth = 0;
        let earningsAll = 0;

        (payments || []).forEach(p => {
          const cid = p.company_id;
          companySet.add(cid);
          companyCountMap[cid] = (companyCountMap[cid] || 0) + 1;
          const amt = Number(p.amount) || 0;
          earningsAll += amt;
          const created = new Date(p.created_at);
          if (created >= monthStart) {
            earningsThisMonth += amt;
          }
        });

        const repeatCount = Object.values(companyCountMap).filter(c => c > 1).length;

        setTotalCompanies(companySet.size);
        setMonthlyEarnings(earningsThisMonth);
        setTotalEarnings(earningsAll);
        setRepeatPurchases(repeatCount);
        setRecentPayments((payments || []).slice(0, 10));
        setCompanyList(companies || []);
        setLoading(false);
      } catch (e) {
        console.error('OwnerAnalytics fetch error', e);
        setError(e.message || 'Failed to load analytics');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
        <div style={{ fontSize: '32px', marginBottom: '12px', animation: 'pulse 1.5s infinite' }}>📊</div>
        <p style={{ color: 'var(--text-secondary)' }}>Loading analytics from Supabase…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
        <div style={{ fontSize: '32px', marginBottom: '12px' }}>⚠️</div>
        <p style={{ color: 'var(--color-danger)', fontWeight: 600 }}>{error}</p>
        <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '8px' }}>
          Make sure the Supabase tables are created. Run the SQL in <code>supabase_schema.sql</code>.
        </p>
      </div>
    );
  }

  const formatCurrency = (val) => '₹' + val.toLocaleString('en-IN');
  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div>
      {/* Admin Banner */}
      <div style={{
        background: 'linear-gradient(135deg, hsl(265 80% 55%), hsl(220 90% 50%))',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '16px',
        color: '#fff'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <span style={{ fontSize: '24px' }}>🔒</span>
          <h3 style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>Owner Analytics Dashboard</h3>
        </div>
        <p style={{ opacity: 0.85, fontSize: '13px', margin: 0 }}>
          Private view · Accessible only through admin link · Live data from Supabase
        </p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '16px' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '28px', marginBottom: '4px' }}>🏢</div>
          <div className="stat-card-value" style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-brand)' }}>{totalCompanies}</div>
          <div className="stat-card-title" style={{ fontSize: '12px', marginTop: '4px' }}>Total Companies</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '28px', marginBottom: '4px' }}>💰</div>
          <div className="stat-card-value" style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-success)' }}>{formatCurrency(monthlyEarnings)}</div>
          <div className="stat-card-title" style={{ fontSize: '12px', marginTop: '4px' }}>This Month's Earnings</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '28px', marginBottom: '4px' }}>📈</div>
          <div className="stat-card-value" style={{ fontSize: '28px', fontWeight: 800, color: 'hsl(265 80% 55%)' }}>{formatCurrency(totalEarnings)}</div>
          <div className="stat-card-title" style={{ fontSize: '12px', marginTop: '4px' }}>Total Revenue</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '28px', marginBottom: '4px' }}>🔄</div>
          <div className="stat-card-value" style={{ fontSize: '28px', fontWeight: 800, color: '#eab308' }}>{repeatPurchases}</div>
          <div className="stat-card-title" style={{ fontSize: '12px', marginTop: '4px' }}>Repeat Buyers</div>
        </div>
      </div>

      {/* Recent Payments Table */}
      <div className="card" style={{ marginBottom: '16px' }}>
        <h3 style={{ fontSize: '18px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>💳</span> Recent Payments
        </h3>
        {recentPayments.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>No payments recorded yet.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '10px' }}>Company</th>
                  <th style={{ padding: '10px' }}>Amount</th>
                  <th style={{ padding: '10px' }}>Plan</th>
                  <th style={{ padding: '10px' }}>Date</th>
                  <th style={{ padding: '10px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentPayments.map((p, i) => (
                  <tr key={p.id || i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '10px', fontWeight: 600 }}>{p.companies?.name || '—'}</td>
                    <td style={{ padding: '10px', color: 'var(--color-success)', fontWeight: 600 }}>{formatCurrency(Number(p.amount))}</td>
                    <td style={{ padding: '10px', textTransform: 'uppercase', fontSize: '11px', fontWeight: 700, color: p.plan === 'pro' ? 'hsl(265 80% 55%)' : 'var(--text-secondary)' }}>{p.plan}</td>
                    <td style={{ padding: '10px', color: 'var(--text-secondary)' }}>{formatDate(p.created_at)}</td>
                    <td style={{ padding: '10px' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '3px 10px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: 700,
                        background: p.status === 'success' ? 'hsla(142, 76%, 36%, 0.15)' : 'hsla(0, 76%, 50%, 0.15)',
                        color: p.status === 'success' ? 'var(--color-success)' : 'var(--color-danger)'
                      }}>
                        {p.status === 'success' ? '✓ Paid' : '✗ Failed'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Companies List */}
      <div className="card">
        <h3 style={{ fontSize: '18px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>🏢</span> Registered Companies
        </h3>
        {companyList.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>No companies registered yet.</p>
        ) : (
          <div className="analytics-companies-grid">
            {companyList.map((c, i) => (
              <div key={c.id || i} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderRadius: '12px',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)'
              }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '14px' }}>{c.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{c.email || 'No email'}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{
                    display: 'inline-block',
                    padding: '3px 10px',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: 700,
                    background: c.plan === 'pro' ? 'hsla(265, 80%, 55%, 0.15)' : 'hsla(200, 50%, 50%, 0.15)',
                    color: c.plan === 'pro' ? 'hsl(265 80% 55%)' : 'var(--text-secondary)',
                    textTransform: 'uppercase'
                  }}>
                    {c.plan || 'starter'}
                  </span>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Joined {formatDate(c.created_at)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerAnalytics;
