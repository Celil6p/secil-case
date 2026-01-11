interface EnvErrorProps {
  missingVars: string[];
}

const ENV_DESCRIPTIONS: Record<string, { description: string; example: string }> = {
  AUTH_SECRET: {
    description: "NextAuth JWT şifreleme anahtarı",
    example: "openssl rand -base64 32",
  },
  AUTH_TRUST_HOST: {
    description: "NextAuth güvenilir host ayarı",
    example: "AUTH_TRUST_HOST=true",
  },
};

export function EnvError({ missingVars }: EnvErrorProps) {
  return (
    <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white border-2 border-red-200 rounded-lg shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Yapılandırma Hatası</h1>
          <p className="mt-2 text-gray-600">
            Bu uygulama çalışmak için gerekli ortam değişkenlerine sahip değil.
          </p>
        </div>

        {/* Missing Variables List */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-red-900 mb-4">
            Eksik Ortam Değişkenleri:
          </h2>
          <ul className="space-y-4">
            {missingVars.map((varName) => {
              const info = ENV_DESCRIPTIONS[varName];
              return (
                <li key={varName} className="pl-4 border-l-4 border-red-400">
                  <code className="block text-sm font-mono text-red-800 font-semibold mb-1">
                    {varName}
                  </code>
                  <p className="text-sm text-gray-700 mb-1">{info?.description}</p>
                  <p className="text-xs text-gray-500">
                    Örnek: <code className="bg-red-100 px-1 py-0.5 rounded">{info?.example}</code>
                  </p>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">
            Nasıl Düzeltilir:
          </h3>
          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
            <li>
              <strong>.env.local</strong> dosyasını oluşturun veya düzenleyin
            </li>
            <li>
              Yukarıdaki eksik değişkenleri ekleyin
            </li>
            <li>
              Uygulamayı yeniden başlatın
            </li>
          </ol>
          <p className="mt-3 text-xs text-blue-700">
            Bu hata sadece geliştirme ortamında gösterilir. Production&apos;da sunucu
            yapılandırmasını kontrol edin.
          </p>
        </div>

        {/* Case Receiver Notice */}
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Case Receiver:</strong> Bu uygulama eksik yapılandırma nedeniyle çalışamaz.
            Lütfen ortam değişkenlerini ayarlayın ve uygulamayı yeniden başlatın.
          </p>
        </div>
      </div>
    </div>
  );
}
