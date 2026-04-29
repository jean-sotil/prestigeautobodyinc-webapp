'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';

const PHONE = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || '';

const i18n = {
  en: {
    popupTitle: 'Start a Conversation',
    popupIntro: 'Hi! Click below to chat on',
    notice: 'The team typically replies in a few minutes.',
    bubbleQuestion: 'Need help?',
    bubbleCta: 'Chat with us',
    defaultMessage:
      "Hi, I'm visiting your website and I'd like more information.",
    agentName: 'Prestige Auto Body',
    agentRole: 'Customer Service',
  },
  es: {
    popupTitle: 'Iniciar una Conversación',
    popupIntro: 'Hola! Haz clic abajo para chatear por',
    notice: 'El equipo suele responder en unos minutos.',
    bubbleQuestion: '¿Necesitas ayuda?',
    bubbleCta: 'Chatea con nosotros',
    defaultMessage:
      'Hola, estoy visitando su sitio web y me gustaría más información.',
    agentName: 'Prestige Auto Body',
    agentRole: 'Servicio al Cliente',
  },
} as const;

function WhatsAppIcon({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export default function WhatsAppWidget() {
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const locale = useLocale();
  const t = locale === 'es' ? i18n.es : i18n.en;
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${PHONE}&text=${encodeURIComponent(t.defaultMessage)}`;

  if (!PHONE) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 12,
      }}
    >
      {/* Popup */}
      {open && (
        <div
          style={{
            width: 320,
            borderRadius: 12,
            overflow: 'hidden',
            boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
            border: '1px solid #e5e5e5',
          }}
        >
          <div style={{ background: '#2db742', padding: '16px 20px' }}>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: 18 }}>
              {t.popupTitle}
            </div>
            <div style={{ color: '#d9ebc6', fontSize: 12, marginTop: 4 }}>
              {t.popupIntro} <strong>WhatsApp</strong>
            </div>
          </div>
          <div style={{ background: '#fff', padding: 16 }}>
            <div style={{ color: '#888', fontSize: 11, marginBottom: 12 }}>
              {t.notice}
            </div>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: 12,
                borderRadius: 8,
                textDecoration: 'none',
                color: 'inherit',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = '#f5f5f5')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = 'transparent')
              }
            >
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    background: '#2db742',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                  }}
                >
                  <WhatsAppIcon size={24} />
                </div>
                <span
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: 12,
                    height: 12,
                    background: '#2db742',
                    border: '2px solid #fff',
                    borderRadius: '50%',
                  }}
                />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#333' }}>
                  {t.agentName}
                </div>
                <div style={{ fontSize: 11, color: '#888' }}>{t.agentRole}</div>
              </div>
            </a>
          </div>
        </div>
      )}

      {/* Button row */}
      <div
        style={{ display: 'flex', alignItems: 'center', gap: 8 }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {/* Tooltip on hover (hidden when popup is open) */}
        {!open && hover && (
          <div
            style={{
              background: '#fff',
              color: '#333',
              fontSize: 14,
              padding: '8px 16px',
              borderRadius: 8,
              boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
              border: '1px solid #e5e5e5',
              whiteSpace: 'nowrap',
            }}
          >
            <span>{t.bubbleQuestion} </span>
            <strong>{t.bubbleCta}</strong>
          </div>
        )}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-label="WhatsApp"
          style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: hover ? '#25a03a' : '#2db742',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(45,183,66,0.4)',
            transition: 'transform 0.2s, background 0.2s',
            transform: hover ? 'scale(1.05)' : 'scale(1)',
          }}
        >
          {open ? <CloseIcon /> : <WhatsAppIcon />}
        </button>
      </div>
    </div>
  );
}
