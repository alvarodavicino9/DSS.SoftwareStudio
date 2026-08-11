import Logo from './Logo';

export default function Footer() {
  return (
    <footer style={{ padding: 40, maxWidth: 1200, margin: '0 auto' }}>
      <div
        style={{
          height: 1,
          marginBottom: 24,
          background: 'linear-gradient(to right, transparent, var(--border-neutral) 48px, var(--border-neutral) calc(100% - 48px), transparent)',
        }}
      />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <p style={{ fontSize: 12, color: 'var(--text-tertiary)', margin: 0 }}>
            © {new Date().getFullYear()} DS.SoftwareStudio • Álvaro Davicino &amp; Gabriel Schurrer
          </p>
          <p style={{ fontSize: 12, color: 'var(--text-faint)', margin: '4px 0 0' }}>DSSoftwareStudio.com.ar</p>
        </div>
        <Logo variant="mark" height={20} style={{ opacity: 0.85 }} />
      </div>
    </footer>
  );
}
